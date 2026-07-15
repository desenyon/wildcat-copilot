import { PgBoss } from "pg-boss";
import { getEnv } from "@/lib/validation/env";

let boss: PgBoss | undefined;
let startPromise: Promise<PgBoss> | undefined;

/**
 * pg-boss runs its queue tables in a "pgboss" schema on the same Postgres
 * instance (see docker-compose.yml) rather than standing up Redis/SQS for
 * P-0. Revisit if job volume or fan-out needs outgrow a single Postgres
 * instance (see docs/DECISIONS.md).
 */
export async function getJobClient(): Promise<PgBoss> {
  if (boss) return boss;
  if (!startPromise) {
    startPromise = (async () => {
      const instance = new PgBoss({ connectionString: getEnv().DATABASE_URL });
      instance.on("error", (error: Error) => console.error("[jobs] pg-boss error", error));
      await instance.start();
      boss = instance;
      return instance;
    })();
  }
  return startPromise;
}

export async function stopJobClient(): Promise<void> {
  if (boss) {
    await boss.stop({ graceful: true, timeout: 5000 });
    boss = undefined;
    startPromise = undefined;
  }
}
