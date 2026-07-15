import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getEnv } from "@/lib/validation/env";
import * as schema from "./schema";

let queryClient: ReturnType<typeof postgres> | undefined;
let dbClient: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!dbClient) {
    queryClient = postgres(getEnv().DATABASE_URL);
    dbClient = drizzle(queryClient, { schema });
  }
  return dbClient;
}

export type Database = ReturnType<typeof getDb>;
