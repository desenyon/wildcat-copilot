import type { Job } from "pg-boss";
import { getJobClient } from "@/lib/jobs/client";
import { QUEUES, ensureQueue } from "@/lib/jobs/queues";
import {
  documentProcessingPayloadSchema,
  type DocumentProcessingPayload,
} from "@/lib/jobs/payloads";

/**
 * Parses/chunks/embeds an uploaded course document. The parse/chunk/embed
 * pipeline itself ships in T1.2.4; this registers the queue wiring so
 * T0.4.5's acceptance criteria (queue exists, retries, job status visible)
 * can be verified before that pipeline exists.
 */
export async function registerDocumentProcessingWorker(): Promise<void> {
  await ensureQueue(QUEUES.documentProcessing);
  const boss = await getJobClient();
  await boss.work<DocumentProcessingPayload>(
    QUEUES.documentProcessing,
    async ([job]: Job<DocumentProcessingPayload>[]) => {
      const payload = documentProcessingPayloadSchema.parse(job.data);
      console.log(`[document-processing] processing course document ${payload.courseDocumentId}`);
      // Parsing/chunking/embedding lands in T1.2.4.
    },
  );
}
