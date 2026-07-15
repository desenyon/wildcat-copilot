import { eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { getOrCreateOrganizationForEmail } from "./organization";

export async function upsertUserOnSignIn(params: {
  clerkUserId: string;
  email: string;
  displayName: string;
}) {
  const db = getDb();
  const email = params.email.toLowerCase();
  const organization = await getOrCreateOrganizationForEmail(email);

  const [user] = await db
    .insert(users)
    .values({
      organizationId: organization.id,
      clerkUserId: params.clerkUserId,
      email,
      displayName: params.displayName,
      authProvider: "clerk",
    })
    .onConflictDoUpdate({
      target: users.clerkUserId,
      set: { email, displayName: params.displayName, lastActiveAt: sql`now()` },
    })
    .returning();

  return user;
}

export async function getUserByClerkId(clerkUserId: string) {
  const db = getDb();
  return db.query.users.findFirst({ where: eq(users.clerkUserId, clerkUserId) });
}
