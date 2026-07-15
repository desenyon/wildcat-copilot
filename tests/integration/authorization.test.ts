import { describe, expect, it } from "vitest";
import { withTestDb } from "./db-helpers";
import { organizations, users, courses } from "@/lib/db/schema";

// requireCourseAccess reads through the shared db client (lib/db/client.ts),
// not the per-test transaction handle, so these tests exercise the same
// authorization logic (lib/auth/authorization.ts) directly against rows
// inserted via the transaction, using the checkCourseAccess helper that
// doesn't require a live Next.js request/session.
import { checkCourseAccess, ForbiddenError } from "@/lib/auth/course-access";

describe("course authorization", () => {
  it("allows the owning teacher, denies a different org, denies a different owner in the same org", async () => {
    await withTestDb(async (db) => {
      const [orgA] = await db
        .insert(organizations)
        .values({ name: "LGHS", slug: `lghs-${Date.now()}` })
        .returning();
      const [orgB] = await db
        .insert(organizations)
        .values({ name: "Other School", slug: `other-${Date.now()}` })
        .returning();

      const [teacherA] = await db
        .insert(users)
        .values({
          organizationId: orgA.id,
          clerkUserId: `user_test_a_${Date.now()}`,
          email: `teacher-a-${Date.now()}@example.com`,
          displayName: "Teacher A",
        })
        .returning();
      const [teacherA2] = await db
        .insert(users)
        .values({
          organizationId: orgA.id,
          clerkUserId: `user_test_a2_${Date.now()}`,
          email: `teacher-a2-${Date.now()}@example.com`,
          displayName: "Teacher A2",
        })
        .returning();
      const [teacherB] = await db
        .insert(users)
        .values({
          organizationId: orgB.id,
          clerkUserId: `user_test_b_${Date.now()}`,
          email: `teacher-b-${Date.now()}@example.com`,
          displayName: "Teacher B",
        })
        .returning();

      const [course] = await db
        .insert(courses)
        .values({
          organizationId: orgA.id,
          ownerUserId: teacherA.id,
          name: "Introduction to Biology",
          subject: "Science",
          gradeBand: "9-10",
          academicTerm: "Fall 2026",
        })
        .returning();

      expect(
        checkCourseAccess(course, {
          userId: teacherA.id,
          organizationId: orgA.id,
          role: "teacher",
        }),
      ).toBe(true);

      expect(() =>
        checkCourseAccess(course, {
          userId: teacherB.id,
          organizationId: orgB.id,
          role: "teacher",
        }),
      ).toThrow(ForbiddenError);

      expect(() =>
        checkCourseAccess(course, {
          userId: teacherA2.id,
          organizationId: orgA.id,
          role: "teacher",
        }),
      ).toThrow(ForbiddenError);

      expect(
        checkCourseAccess(
          course,
          { userId: teacherA2.id, organizationId: orgA.id, role: "teacher" },
          { anyOwnerInOrg: true },
        ),
      ).toBe(true);
    });
  });
});
