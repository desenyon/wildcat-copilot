import { readFile } from "node:fs/promises";
import { eq } from "drizzle-orm";
import type { Job } from "pg-boss";
import { getJobClient } from "@/lib/jobs/client";
import { QUEUES, ensureQueue } from "@/lib/jobs/queues";
import {
  documentProcessingPayloadSchema,
  type DocumentProcessingPayload,
} from "@/lib/jobs/payloads";
import { getDb } from "@/lib/db/client";
import { courseDocuments, documentChunks } from "@/lib/db/schema";
import { LocalStorageProvider } from "@/lib/documents/storage/local";
import { chunkText, extractText, UnsupportedFormatForExtractionError } from "@/lib/documents/parse";

/**
 * Parses and chunks an uploaded course document (T1.2.4). Real extraction
 * covers plain text/Markdown (direct decode) and PDF/DOCX/PPTX (via
 * `officeparser`). Embeddings aren't generated here yet: that needs an LLM
 * provider, which isn't chosen (see docs/DECISIONS.md).
 */
export async function registerDocumentProcessingWorker(): Promise<void> {
  await ensureQueue(QUEUES.documentProcessing);
  const boss = await getJobClient();
  await boss.work<DocumentProcessingPayload>(
    QUEUES.documentProcessing,
    async ([job]: Job<DocumentProcessingPayload>[]) => {
      const payload = documentProcessingPayloadSchema.parse(job.data);
      const db = getDb();

      const document = await db.query.courseDocuments.findFirst({
        where: eq(courseDocuments.id, payload.courseDocumentId),
      });
      if (!document) {
        console.warn(`[document-processing] document ${payload.courseDocumentId} no longer exists`);
        return;
      }

      try {
        const provider = new LocalStorageProvider();
        const buffer = await readFile(provider.resolvePath(document.storageKey));
        const text = await extractText(document.mimeType, buffer);
        const chunks = chunkText(text);

        if (chunks.length > 0) {
          await db.insert(documentChunks).values(
            chunks.map((chunk) => ({
              courseDocumentId: document.id,
              courseId: document.courseId,
              sequenceNumber: chunk.sequenceNumber,
              text: chunk.text,
            })),
          );
        }

        await db
          .update(courseDocuments)
          .set({ processingStatus: "processed", processingErrorCode: null })
          .where(eq(courseDocuments.id, document.id));

        console.log(
          `[document-processing] processed ${document.id} into ${chunks.length} chunk(s)`,
        );
      } catch (error) {
        const errorCode =
          error instanceof UnsupportedFormatForExtractionError
            ? "unsupported_format_extraction_not_implemented"
            : "extraction_failed";

        await db
          .update(courseDocuments)
          .set({ processingStatus: "failed", processingErrorCode: errorCode })
          .where(eq(courseDocuments.id, document.id));

        console.warn(`[document-processing] failed ${document.id}: ${errorCode}`, error);
      }
    },
  );
}
