import { getJobClient } from "./client";

export const QUEUES = {
  documentProcessing: "document-processing",
  generation: "generation",
  export: "export",
} as const;

export type QueueName = (typeof QUEUES)[keyof typeof QUEUES];

/**
 * Bounded retries with backoff + a dead letter queue per AGENTS.md §4.9
 * ("Add retries with bounded backoff", "Add dead letter handling"). Each
 * queue's dead-letter queue is `<queue>-dead-letter`; failed-after-retries
 * jobs land there for manual triage rather than disappearing.
 *
 * `policy: "stately"` (pg-boss v12+) is required for `singletonKey` to
 * actually dedupe — the default "standard" policy allows unlimited jobs per
 * key. "stately" allows at most one queued *and* one active job per key,
 * which is what AGENTS.md's "duplicate requests do not create duplicate
 * artifacts" (T0.4.5) needs.
 */
export const QUEUE_CONFIG: Record<
  QueueName,
  { policy: "stately"; retryLimit: number; retryDelay: number; retryBackoff: boolean }
> = {
  [QUEUES.documentProcessing]: {
    policy: "stately",
    retryLimit: 3,
    retryDelay: 5,
    retryBackoff: true,
  },
  [QUEUES.generation]: { policy: "stately", retryLimit: 2, retryDelay: 10, retryBackoff: true },
  [QUEUES.export]: { policy: "stately", retryLimit: 3, retryDelay: 5, retryBackoff: true },
};

export function deadLetterQueueName(queue: QueueName): string {
  return `${queue}-dead-letter`;
}

const ensuredQueues = new Set<QueueName>();

/**
 * Must be called by both the producer (publishJob) and the worker
 * (registerXWorker) before using a queue — pg-boss requires createQueue()
 * to have run before send() or work() will succeed against it, and either
 * side may be the first process to touch a given queue.
 */
export async function ensureQueue(queue: QueueName): Promise<void> {
  if (ensuredQueues.has(queue)) return;
  const boss = await getJobClient();
  const config = QUEUE_CONFIG[queue];
  const dlq = deadLetterQueueName(queue);

  await boss.createQueue(dlq);
  // Note: queue policy is immutable after creation (pg-boss). If QUEUE_CONFIG's
  // policy for a queue changes, the queue must be deleted and recreated —
  // createQueue() below is a no-op for an existing queue's other options too.
  await boss.createQueue(queue, {
    policy: config.policy,
    retryLimit: config.retryLimit,
    retryDelay: config.retryDelay,
    retryBackoff: config.retryBackoff,
    deadLetter: dlq,
  });
  ensuredQueues.add(queue);
}

// Exposed for tests that need to reset queue-creation memoization between runs.
export function __resetEnsuredQueuesForTests(): void {
  ensuredQueues.clear();
}
