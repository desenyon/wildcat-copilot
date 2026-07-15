import type { Job } from "pg-boss";
import { getJobClient } from "@/lib/jobs/client";
import { QUEUES, ensureQueue } from "@/lib/jobs/queues";
import { generationPayloadSchema, type GenerationPayload } from "@/lib/jobs/payloads";

/**
 * Runs the AI generation pipeline (AGENTS.md §4.4) for a GenerationRequest.
 * The pipeline itself ships across M1.3; this registers the queue wiring.
 */
export async function registerGenerationWorker(): Promise<void> {
  await ensureQueue(QUEUES.generation);
  const boss = await getJobClient();
  await boss.work<GenerationPayload>(QUEUES.generation, async ([job]: Job<GenerationPayload>[]) => {
    const payload = generationPayloadSchema.parse(job.data);
    console.log(`[generation] processing generation request ${payload.generationRequestId}`);
    // Planning + section-by-section generation lands across M1.3.
  });
}
