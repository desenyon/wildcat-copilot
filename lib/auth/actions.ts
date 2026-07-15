"use server";

import { eq } from "drizzle-orm";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { getUserByClerkId } from "./user";

/**
 * Deletes the signed-in user's own account and every row that cascades from
 * it (courses they own, documents, artifacts, ...) in our DB, and their
 * Clerk identity. This is a hard delete, not a deactivation, per AGENTS.md
 * §4.7 "clear course deletion controls" / §0.6 teacher control principle. It
 * does not delete the organization.
 */
export async function deleteOwnAccountAction() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Not signed in");

  const dbUser = await getUserByClerkId(clerkUserId);
  const db = getDb();
  if (dbUser) {
    await db.delete(users).where(eq(users.id, dbUser.id));
  }

  const client = await clerkClient();
  await client.users.deleteUser(clerkUserId);
}
