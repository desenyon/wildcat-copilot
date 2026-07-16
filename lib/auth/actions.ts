"use server";

import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { getUserByClerkId } from "./user";
import { requireActor } from "./authorization";
import { listCoursesForActor } from "@/lib/courses/queries";

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

/**
 * Marks the pilot welcome flow (T1.1.1) complete and records the teacher's
 * explicit choice on pilot analytics consent (AGENTS.md §6.5: "Record
 * explicit consent state"). Redirects straight into course creation if the
 * teacher has no courses yet, otherwise into the dashboard.
 */
export async function completeOnboardingAction(formData: FormData) {
  const actor = await requireActor();

  const consent = formData.get("pilotAnalyticsConsent") === "on";
  const db = getDb();
  await db
    .update(users)
    .set({ onboardedAt: sql`now()`, pilotAnalyticsConsent: consent })
    .where(eq(users.id, actor.userId));

  const courses = await listCoursesForActor(actor);
  redirect(courses.length > 0 ? "/home" : "/courses/new");
}
