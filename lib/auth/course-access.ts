export class ForbiddenError extends Error {
  constructor(message = "Not authorized") {
    super(message);
  }
}

export interface AuthenticatedActor {
  userId: string;
  organizationId: string;
  role: string;
}

interface CourseOwnership {
  organizationId: string;
  ownerUserId: string;
}

/**
 * Pure authorization check, no DB/session access, so it's cheap to unit test
 * directly (see tests/integration/authorization.test.ts) without pulling in
 * the Clerk runtime. Course "ownership" for P-1 is single-teacher;
 * department-level sharing (multiple owners in an org) is a P-5/M5.2
 * concern, not P-1.
 */
export function checkCourseAccess(
  course: CourseOwnership,
  actor: AuthenticatedActor,
  options: { anyOwnerInOrg?: boolean } = {},
): true {
  if (course.organizationId !== actor.organizationId) {
    throw new ForbiddenError("Course does not belong to your organization");
  }
  if (!options.anyOwnerInOrg && course.ownerUserId !== actor.userId) {
    throw new ForbiddenError("You do not own this course");
  }
  return true;
}
