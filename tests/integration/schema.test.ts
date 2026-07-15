import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { withTestDb } from "./db-helpers";
import { organizations, users, courses, artifacts, artifactVersions } from "@/lib/db/schema";

describe("database schema", () => {
  it("enforces cascading deletion from course to artifacts", async () => {
    await withTestDb(async (db) => {
      const [org] = await db
        .insert(organizations)
        .values({ name: "LGHS", slug: `lghs-${Date.now()}` })
        .returning();

      const [teacher] = await db
        .insert(users)
        .values({
          organizationId: org.id,
          email: `teacher-${Date.now()}@example.com`,
          displayName: "Test Teacher",
        })
        .returning();

      const [course] = await db
        .insert(courses)
        .values({
          organizationId: org.id,
          ownerUserId: teacher.id,
          name: "Introduction to Biology",
          subject: "Science",
          gradeBand: "9-10",
          academicTerm: "Fall 2026",
        })
        .returning();

      const [artifact] = await db
        .insert(artifacts)
        .values({
          courseId: course.id,
          artifactType: "assignment",
          title: "Photosynthesis Lab",
          contentJson: {},
          contentText: "",
        })
        .returning();

      await db.insert(artifactVersions).values({
        artifactId: artifact.id,
        versionNumber: 1,
        contentJson: {},
        contentText: "",
        createdByType: "model",
      });

      await db.delete(courses).where(eq(courses.id, course.id));

      const remaining = await db.select().from(artifacts).where(eq(artifacts.courseId, course.id));
      expect(remaining).toHaveLength(0);
    });
  });

  it("rejects a duplicate idempotency key on generation requests", async () => {
    const { generationRequests } = await import("@/lib/db/schema");
    await withTestDb(async (db) => {
      const [org] = await db
        .insert(organizations)
        .values({ name: "LGHS", slug: `lghs-${Date.now()}` })
        .returning();
      const [teacher] = await db
        .insert(users)
        .values({
          organizationId: org.id,
          email: `teacher-${Date.now()}@example.com`,
          displayName: "Test Teacher",
        })
        .returning();
      const [course] = await db
        .insert(courses)
        .values({
          organizationId: org.id,
          ownerUserId: teacher.id,
          name: "Introduction to Biology",
          subject: "Science",
          gradeBand: "9-10",
          academicTerm: "Fall 2026",
        })
        .returning();

      await db.insert(generationRequests).values({
        courseId: course.id,
        requestedByUserId: teacher.id,
        generationType: "weekly_pack",
        inputPayload: {},
        idempotencyKey: "fixed-key",
      });

      await expect(
        db.insert(generationRequests).values({
          courseId: course.id,
          requestedByUserId: teacher.id,
          generationType: "weekly_pack",
          inputPayload: {},
          idempotencyKey: "fixed-key",
        }),
      ).rejects.toThrow();
    });
  });
});
