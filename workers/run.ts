import { config } from "dotenv";

config({ path: ".env.local" });

import { registerDocumentProcessingWorker } from "./document-processing";
import { registerGenerationWorker } from "./generation";
import { registerExportWorker } from "./export";
import { stopJobClient } from "@/lib/jobs/client";

async function main() {
  await Promise.all([
    registerDocumentProcessingWorker(),
    registerGenerationWorker(),
    registerExportWorker(),
  ]);
  console.log("[workers] all queues registered, waiting for jobs");
}

process.on("SIGINT", async () => {
  await stopJobClient();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await stopJobClient();
  process.exit(0);
});

main().catch((error) => {
  console.error("[workers] failed to start", error);
  process.exit(1);
});
