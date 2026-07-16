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

  // Uses the export queue rather than document-processing: the real
  // document-processing worker (tests/integration/document-processing.test.ts)
  // also registers on that queue in this same test run, and pg-boss
  // round-robins jobs between every registered worker on a queue — this
  // generic pub/sub test would otherwise flakily race against it.
  it("publishes, processes, and reports completed status for a job", async () => {
    await ensureQueue(QUEUES.export);
    const boss = await getJobClient();

    const processed: string[] = [];
    await boss.work(QUEUES.export, async ([job]) => {
      processed.push((job.data as { artifactVersionId: string }).artifactVersionId);
    });

    const key = `test-idempotency-${Date.now()}`;
    const jobId = await publishJob(
      QUEUES.export,
      { artifactVersionId: "00000000-0000-0000-0000-000000000099", exportType: "pdf" },
      key,
    );
    expect(jobId).toBeTruthy();

    await waitFor(async () => processed.length === 1);
    expect(processed).toEqual(["00000000-0000-0000-0000-000000000099"]);

    await waitFor(async () => (await getJobStatus(QUEUES.export, jobId!)) === "completed");
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
