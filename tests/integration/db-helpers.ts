import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

// Integration tests must run against a real, already-migrated Postgres instance
// (see docker-compose.yml + `npm run db:migrate`), never a mock. Each test runs
// inside a transaction that is always rolled back, so tests never see each
// other's data and never persist anything to the shared dev database.
const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  "postgres://wildcat:wildcat_dev_only@localhost:5432/wildcat_copilot";

const client = postgres(TEST_DATABASE_URL, { max: 1 });
const db = drizzle(client, { schema });

class RollbackSentinel extends Error {}

export async function withTestDb<T>(
  fn: (tx: Parameters<Parameters<typeof db.transaction>[0]>[0]) => Promise<T>,
): Promise<T> {
  let result: T;
  try {
    await db.transaction(async (tx) => {
      result = await fn(tx);
      throw new RollbackSentinel();
    });
  } catch (error) {
    if (!(error instanceof RollbackSentinel)) throw error;
  }
  return result!;
}
