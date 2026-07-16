"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { courseDocuments } from "@/lib/db/schema";
import { requireActor, requireCourseAccess } from "@/lib/auth/authorization";
import { getStorageProvider } from "@/lib/documents/storage/local";
import { requestUploadSchema, type RequestUploadInput } from "./schema";

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.\-_]+/g, "-").slice(0, 150);
}

/**
 * Creates a course_documents row (status "pending") and a short-lived
 * upload ticket for it. Enforces the T1.2.1 "confirm no identifiable
 * student data" requirement server-side, not just in the UI.
 */
export async function requestDocumentUpload(input: RequestUploadInput) {
  const parsed = requestUploadSchema.parse(input);
  const actor = await requireActor();
  await requireCourseAccess(parsed.courseId, actor);

  const db = getDb();
  const storageKey = `${parsed.courseId}/${randomUUID()}-${sanitizeFilename(parsed.filename)}`;

  const [document] = await db
    .insert(courseDocuments)
    .values({
      courseId: parsed.courseId,
      uploadedByUserId: actor.userId,
      title: parsed.filename,
      documentType: parsed.documentType,
      mimeType: parsed.mimeType,
      storageKey,
      checksum: "pending",
      processingStatus: "pending",
      containsStudentData: false,
    })
    .returning();

  const provider = getStorageProvider();
  const ticket = await provider.createUploadTicket({
    storageKey,
    mimeType: parsed.mimeType,
    documentId: document.id,
  });

  revalidatePath("/documents");
  return { documentId: document.id, uploadUrl: ticket.uploadUrl };
}

/** Called by the client if the upload itself fails, so the row doesn't sit stuck at "pending" forever. */
export async function markDocumentUploadFailed(documentId: string) {
  const actor = await requireActor();
  const db = getDb();
  const document = await db.query.courseDocuments.findFirst({
    where: eq(courseDocuments.id, documentId),
  });
  if (!document) return;
  await requireCourseAccess(document.courseId, actor);

  await db
    .update(courseDocuments)
    .set({ processingStatus: "failed", processingErrorCode: "upload_failed" })
    .where(eq(courseDocuments.id, documentId));

  revalidatePath("/documents");
}

export async function deleteDocument(documentId: string) {
  const actor = await requireActor();
  const db = getDb();
  const document = await db.query.courseDocuments.findFirst({
    where: eq(courseDocuments.id, documentId),
  });
  if (!document) return;
  await requireCourseAccess(document.courseId, actor);

  const provider = getStorageProvider();
  await provider.deleteObject(document.storageKey);
  await db.delete(courseDocuments).where(eq(courseDocuments.id, documentId));

  revalidatePath("/documents");
}
