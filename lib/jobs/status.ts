import { getJobClient } from "./client";
import type { QueueName } from "./queues";

export type JobState = "created" | "retry" | "active" | "completed" | "cancelled" | "failed";

export async function getJobStatus(queue: QueueName, jobId: string): Promise<JobState | null> {
  const boss = await getJobClient();
  const job = await boss.getJobById(queue, jobId);
  return (job?.state as JobState) ?? null;
}
