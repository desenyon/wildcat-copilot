"use server";

import { eq } from "drizzle-orm";
import { auth, signIn, signOut } from "@/lib/auth";
import { getDb } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

export async function signInWithGoogle(callbackUrl?: string) {
  await signIn("google", { redirectTo: callbackUrl ?? "/home" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

/**
 * Deletes the signed-in user's own account and every row that cascades from
 * it (courses they own, documents, artifacts, ...). This is a hard delete,
 * not a deactivation, per AGENTS.md §4.7 "clear course deletion controls" /
 * §0.6 teacher control principle. It does not delete the organization.
 */
export async function deleteOwnAccountAction() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not signed in");

  const db = getDb();
  await db.delete(users).where(eq(users.id, session.user.id));
  await signOut({ redirectTo: "/" });
}
