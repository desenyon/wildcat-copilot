import { afterAll, describe, expect, it } from "vitest";
import { getJobClient, stopJobClient } from "@/lib/jobs/client";
import { publishJob } from "@/lib/jobs/publish";
import { getJobStatus } from "@/lib/jobs/status";
import { QUEUES, ensureQueue } from "@/lib/jobs/queues";

async function waitFor(check: () => Promise<boolean>, timeoutMs = 5000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await check()) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Timed out waiting for condition");
}

describe("background jobs", () => {
  afterAll(async () => {
    await stopJobClient();
  });

  it("publishes, processes, and reports completed status for a document-processing job", async () => {
    await ensureQueue(QUEUES.documentProcessing);
    const boss = await getJobClient();

    const processed: string[] = [];
    await boss.work(QUEUES.documentProcessing, async ([job]) => {
      processed.push((job.data as { courseDocumentId: string }).courseDocumentId);
    });

    const key = `test-idempotency-${Date.now()}`;
    const jobId = await publishJob(
      QUEUES.documentProcessing,
      { courseDocumentId: "00000000-0000-0000-0000-000000000099", checksum: "abc123" },
      key,
    );
    expect(jobId).toBeTruthy();

    await waitFor(async () => processed.length === 1);
    expect(processed).toEqual(["00000000-0000-0000-0000-000000000099"]);

    await waitFor(
      async () => (await getJobStatus(QUEUES.documentProcessing, jobId!)) === "completed",
    );
  }, 15000);

  it("does not enqueue a duplicate job for the same idempotency key while one is pending", async () => {
    await ensureQueue(QUEUES.generation);

    const key = `dedup-${Date.now()}`;
    const firstId = await publishJob(QUEUES.generation, { generationRequestId: "x" }, key);
    const secondId = await publishJob(QUEUES.generation, { generationRequestId: "x" }, key);

    expect(firstId).toBeTruthy();
    expect(secondId).toBeNull();
  }, 15000);
});
