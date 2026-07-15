import { eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { getOrCreateOrganizationForEmail } from "./organization";

export async function upsertUserOnSignIn(params: { email: string; displayName: string }) {
  const db = getDb();
  const email = params.email.toLowerCase();
  const organization = await getOrCreateOrganizationForEmail(email);

  const [user] = await db
    .insert(users)
    .values({
      organizationId: organization.id,
      email,
      displayName: params.displayName,
      authProvider: "google",
    })
    .onConflictDoUpdate({
      target: users.email,
      set: { displayName: params.displayName, lastActiveAt: sql`now()` },
    })
    .returning();

  return user;
}

export async function getUserByEmail(email: string) {
  const db = getDb();
  return db.query.users.findFirst({ where: eq(users.email, email.toLowerCase()) });
}
