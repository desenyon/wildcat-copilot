import { getJobClient } from "./client";
import { ensureQueue, type QueueName } from "./queues";

/**
 * `idempotencyKey` maps to pg-boss's singleton key: publishing the same key
 * twice while the first job is still pending/active is a no-op, satisfying
 * AGENTS.md §4.9 "Add idempotency keys" / "Duplicate requests do not create
 * duplicate artifacts" (T0.4.5 acceptance criteria).
 */
export async function publishJob<T extends object>(
  queue: QueueName,
  payload: T,
  idempotencyKey: string,
): Promise<string | null> {
  await ensureQueue(queue);
  const boss = await getJobClient();
  return boss.send(queue, payload, { singletonKey: idempotencyKey });
}
