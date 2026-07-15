import { eq } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db/client";
import { courses } from "@/lib/db/schema";
import { getEnv } from "@/lib/validation/env";
import { checkCourseAccess, ForbiddenError, type AuthenticatedActor } from "./course-access";
import { upsertUserOnSignIn } from "./user";

export { checkCourseAccess, ForbiddenError, type AuthenticatedActor };

export class UnauthenticatedError extends Error {
  constructor() {
    super("Not signed in");
  }
}

export class NotInvitedError extends Error {
  constructor() {
    super("This pilot is invitation-only");
  }
}

/**
 * Every server-side mutation/query that touches course data must go through
 * this — never trust a courseId from the client without checking it belongs
 * to the caller's organization. AGENTS.md §1.5: "prevent cross course and
 * cross organization access", enforced server-side, not just in the UI.
 *
 * Clerk owns identity/session; our own `users`/`organizations` tables (shape
 * defined by AGENTS.md §4.3) are the source of truth for authorization, so
 * every authenticated request upserts into them here. Also enforces
 * PILOT_ALLOWLIST — Clerk's hosted sign-up would otherwise let anyone with a
 * Google/email account in.
 */
export async function requireActor(): Promise<AuthenticatedActor> {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new UnauthenticatedError();

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress?.toLowerCase();
  if (!email) throw new UnauthenticatedError();

  const allowlist = getEnv().PILOT_ALLOWLIST;
  if (allowlist.length > 0 && !allowlist.includes(email)) {
    throw new NotInvitedError();
  }

  const displayName =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || email;
  const dbUser = await upsertUserOnSignIn({ clerkUserId, email, displayName });

  return { userId: dbUser.id, organizationId: dbUser.organizationId, role: dbUser.role };
}

/** Fetches the course and applies {@link checkCourseAccess}, or throws. */
export async function requireCourseAccess(
  courseId: string,
  actor: AuthenticatedActor,
  options: { anyOwnerInOrg?: boolean } = {},
) {
  const db = getDb();
  const course = await db.query.courses.findFirst({ where: eq(courses.id, courseId) });
  if (!course) throw new ForbiddenError("Course not found");

  checkCourseAccess(course, actor, options);
  return course;
}
