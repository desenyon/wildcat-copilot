import { config } from "dotenv";

config({ path: ".env.local" });

import { clerkSetup } from "@clerk/testing/playwright";

export default async function globalSetup() {
  await clerkSetup();
}
