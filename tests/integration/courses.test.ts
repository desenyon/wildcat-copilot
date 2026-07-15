import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { organizations, users, courses } from "@/lib/db/schema";
import { listCoursesForActor } from "@/lib/courses/queries";

// listCoursesForActor reads through the shared db client (lib/db/client.ts),
// not a rolled-back transaction (see tests/integration/db-helpers.ts's note
// on why authorization tests do the same) — so this test commits real rows
// and cleans them up by deleting the organizations it created (cascades).
describe("listCoursesForActor", () => {
  it("scopes results to the actor's own courses within their organization", async () => {
    const db = getDb();
    const suffix = Date.now();

    const [orgA] = await db
      .insert(organizations)
      .values({ name: "LGHS", slug: `lghs-courses-${suffix}` })
      .returning();
    const [orgB] = await db
      .insert(organizations)
      .values({ name: "Other School", slug: `other-courses-${suffix}` })
      .returning();

    try {
      const [teacherA] = await db
        .insert(users)
        .values({
          organizationId: orgA.id,
          clerkUserId: `user_test_courses_a_${suffix}`,
          email: `teacher-courses-a-${suffix}@example.com`,
          displayName: "Teacher A",
        })
        .returning();
      const [teacherA2] = await db
        .insert(users)
        .values({
          organizationId: orgA.id,
          clerkUserId: `user_test_courses_a2_${suffix}`,
          email: `teacher-courses-a2-${suffix}@example.com`,
          displayName: "Teacher A2",
        })
        .returning();
      const [teacherB] = await db
        .insert(users)
        .values({
          organizationId: orgB.id,
          clerkUserId: `user_test_courses_b_${suffix}`,
          email: `teacher-courses-b-${suffix}@example.com`,
          displayName: "Teacher B",
        })
        .returning();

      await db.insert(courses).values([
        {
          organizationId: orgA.id,
          ownerUserId: teacherA.id,
          name: "Owned by A",
          subject: "Science",
          gradeBand: "9-10",
          academicTerm: "Fall 2026",
        },
        {
          organizationId: orgA.id,
          ownerUserId: teacherA2.id,
          name: "Owned by A2, same org",
          subject: "Math",
          gradeBand: "9-10",
          academicTerm: "Fall 2026",
        },
        {
          organizationId: orgB.id,
          ownerUserId: teacherB.id,
          name: "Owned by B, different org",
          subject: "Art",
          gradeBand: "9-10",
          academicTerm: "Fall 2026",
        },
      ]);

      const result = await listCoursesForActor({
        userId: teacherA.id,
        organizationId: orgA.id,
        role: "teacher",
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Owned by A");
    } finally {
      await db.delete(organizations).where(eq(organizations.id, orgA.id));
      await db.delete(organizations).where(eq(organizations.id, orgB.id));
    }
  });
});
