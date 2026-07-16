import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { courseDocuments, documentChunks } from "@/lib/db/schema";

export async function listDocumentsForCourse(courseId: string) {
  const db = getDb();
  return db
    .select()
    .from(courseDocuments)
    .where(eq(courseDocuments.courseId, courseId))
    .orderBy(desc(courseDocuments.createdAt));
}

const PREVIEW_CHAR_LIMIT = 1000;

/** Concatenated extracted text for a processed document, truncated for display (T1.2.5 "Preview extracted text"). */
export async function getDocumentPreviewText(documentId: string): Promise<string> {
  const db = getDb();
  const chunks = await db
    .select({ text: documentChunks.text })
    .from(documentChunks)
    .where(eq(documentChunks.courseDocumentId, documentId))
    .orderBy(asc(documentChunks.sequenceNumber));

  const full = chunks.map((c) => c.text).join("\n\n");
  return full.length > PREVIEW_CHAR_LIMIT ? `${full.slice(0, PREVIEW_CHAR_LIMIT)}…` : full;
}
