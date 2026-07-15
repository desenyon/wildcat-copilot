import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/client";
import { courses } from "@/lib/db/schema";
import { checkCourseAccess, ForbiddenError, type AuthenticatedActor } from "./course-access";

export { checkCourseAccess, ForbiddenError, type AuthenticatedActor };

export class UnauthenticatedError extends Error {
  constructor() {
    super("Not signed in");
  }
}

/**
 * Every server-side mutation/query that touches course data must go through
 * this — never trust a courseId from the client without checking it belongs
 * to the caller's organization. AGENTS.md §1.5: "prevent cross course and
 * cross organization access", enforced server-side, not just in the UI.
 */
export async function requireActor(): Promise<AuthenticatedActor> {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthenticatedError();
  return {
    userId: session.user.id,
    organizationId: session.user.organizationId,
    role: session.user.role,
  };
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
