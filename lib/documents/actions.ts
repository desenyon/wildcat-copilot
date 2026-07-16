"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { courseDocuments } from "@/lib/db/schema";
import { requireActor, requireCourseAccess } from "@/lib/auth/authorization";
import { getStorageProvider } from "@/lib/documents/storage/local";
import { publishJob } from "@/lib/jobs/publish";
import { QUEUES } from "@/lib/jobs/queues";
import { requestUploadSchema, type RequestUploadInput } from "./schema";
import { suggestDocumentType, type DocumentType } from "./classify";
import { getDocumentPreviewText } from "./queries";

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.\-_]+/g, "-").slice(0, 150);
}

/**
 * Creates a course_documents row (status "pending") and a short-lived
 * upload ticket for it. Enforces the T1.2.1 "confirm no identifiable
 * student data" requirement server-side, not just in the UI. Stores
 * classification confidence (T1.2.3): 1.0 if the teacher's chosen type
 * differs from the filename-based suggestion (an explicit correction),
 * otherwise the suggestion's own confidence.
 */
export async function requestDocumentUpload(input: RequestUploadInput) {
  const parsed = requestUploadSchema.parse(input);
  const actor = await requireActor();
  await requireCourseAccess(parsed.courseId, actor);

  const db = getDb();
  const storageKey = `${parsed.courseId}/${randomUUID()}-${sanitizeFilename(parsed.filename)}`;

  const suggestion = suggestDocumentType(parsed.filename);
  const confidence = parsed.documentType === suggestion.documentType ? suggestion.confidence : 1;

  const [document] = await db
    .insert(courseDocuments)
    .values({
      courseId: parsed.courseId,
      uploadedByUserId: actor.userId,
      title: parsed.filename,
      documentType: parsed.documentType,
      documentTypeConfidence: confidence,
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

export async function renameDocument(documentId: string, title: string) {
  const trimmed = title.trim();
  if (!trimmed) throw new Error("Title cannot be empty");

  const actor = await requireActor();
  const db = getDb();
  const document = await db.query.courseDocuments.findFirst({
    where: eq(courseDocuments.id, documentId),
  });
  if (!document) return;
  await requireCourseAccess(document.courseId, actor);

  await db
    .update(courseDocuments)
    .set({ title: trimmed.slice(0, 300) })
    .where(eq(courseDocuments.id, documentId));

  revalidatePath("/documents");
}

/** Teacher-driven type change (T1.2.3 "teacher can override the type") — always full confidence. */
export async function changeDocumentType(documentId: string, documentType: DocumentType) {
  const actor = await requireActor();
  const db = getDb();
  const document = await db.query.courseDocuments.findFirst({
    where: eq(courseDocuments.id, documentId),
  });
  if (!document) return;
  await requireCourseAccess(document.courseId, actor);

  await db
    .update(courseDocuments)
    .set({ documentType, documentTypeConfidence: 1 })
    .where(eq(courseDocuments.id, documentId));

  revalidatePath("/documents");
}

/** Re-runs extraction/chunking (T1.2.5 "Reprocess document") — clears old chunks and re-enqueues. */
export async function reprocessDocument(documentId: string) {
  const actor = await requireActor();
  const db = getDb();
  const document = await db.query.courseDocuments.findFirst({
    where: eq(courseDocuments.id, documentId),
  });
  if (!document) return;
  await requireCourseAccess(document.courseId, actor);

  const { documentChunks } = await import("@/lib/db/schema");
  await db.delete(documentChunks).where(eq(documentChunks.courseDocumentId, documentId));
  await db
    .update(courseDocuments)
    .set({ processingStatus: "processing", processingErrorCode: null })
    .where(eq(courseDocuments.id, documentId));

  await publishJob(
    QUEUES.documentProcessing,
    { courseDocumentId: documentId, checksum: document.checksum },
    `reprocess-${documentId}-${Date.now()}`,
  );

  revalidatePath("/documents");
}

export async function getDocumentPreviewAction(documentId: string): Promise<string> {
  const actor = await requireActor();
  const db = getDb();
  const document = await db.query.courseDocuments.findFirst({
    where: eq(courseDocuments.id, documentId),
  });
  if (!document) return "";
  await requireCourseAccess(document.courseId, actor);

  return getDocumentPreviewText(documentId);
}
