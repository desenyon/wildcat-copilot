import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { organizations, users, courses, courseDocuments, artifacts } from "@/lib/db/schema";
import { getCourseDataUsage, listCoursesForActor } from "@/lib/courses/queries";

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
        onboardedAt: null,
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Owned by A");
    } finally {
      await db.delete(organizations).where(eq(organizations.id, orgA.id));
      await db.delete(organizations).where(eq(organizations.id, orgB.id));
    }
  });
});

describe("getCourseDataUsage", () => {
  it("counts only documents/artifacts belonging to the given course", async () => {
    const db = getDb();
    const suffix = Date.now();

    const [org] = await db
      .insert(organizations)
      .values({ name: "LGHS", slug: `lghs-usage-${suffix}` })
      .returning();

    try {
      const [teacher] = await db
        .insert(users)
        .values({
          organizationId: org.id,
          clerkUserId: `user_test_usage_${suffix}`,
          email: `teacher-usage-${suffix}@example.com`,
          displayName: "Teacher",
        })
        .returning();

      const [courseA, courseB] = await db
        .insert(courses)
        .values([
          {
            organizationId: org.id,
            ownerUserId: teacher.id,
            name: "Course A",
            subject: "Science",
            gradeBand: "9-10",
            academicTerm: "Fall 2026",
          },
          {
            organizationId: org.id,
            ownerUserId: teacher.id,
            name: "Course B",
            subject: "Math",
            gradeBand: "9-10",
            academicTerm: "Fall 2026",
          },
        ])
        .returning();

      await db.insert(courseDocuments).values([
        {
          courseId: courseA.id,
          uploadedByUserId: teacher.id,
          title: "Syllabus",
          mimeType: "application/pdf",
          storageKey: `test/${suffix}/a.pdf`,
          checksum: "abc",
        },
        {
          courseId: courseB.id,
          uploadedByUserId: teacher.id,
          title: "Other course doc",
          mimeType: "application/pdf",
          storageKey: `test/${suffix}/b.pdf`,
          checksum: "def",
        },
      ]);
      await db.insert(artifacts).values({
        courseId: courseA.id,
        artifactType: "assignment",
        title: "Lab report",
        contentJson: {},
        contentText: "",
      });

      const usage = await getCourseDataUsage(courseA.id);
      expect(usage).toEqual({ documentCount: 1, artifactCount: 1 });
    } finally {
      await db.delete(organizations).where(eq(organizations.id, org.id));
    }
  });
});
