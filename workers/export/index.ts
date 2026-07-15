import type { Job } from "pg-boss";
import { getJobClient } from "@/lib/jobs/client";
import { QUEUES, ensureQueue } from "@/lib/jobs/queues";
import { exportPayloadSchema, type ExportPayload } from "@/lib/jobs/payloads";

/**
 * Renders an artifact version to DOCX/PDF/Canvas HTML (M1.8). This
 * registers the queue wiring; the renderers themselves ship per export type.
 */
export async function registerExportWorker(): Promise<void> {
  await ensureQueue(QUEUES.export);
  const boss = await getJobClient();
  await boss.work<ExportPayload>(QUEUES.export, async ([job]: Job<ExportPayload>[]) => {
    const payload = exportPayloadSchema.parse(job.data);
    console.log(
      `[export] rendering artifact version ${payload.artifactVersionId} as ${payload.exportType}`,
    );
    // DOCX/PDF/Canvas HTML rendering lands in M1.8.
  });
}
