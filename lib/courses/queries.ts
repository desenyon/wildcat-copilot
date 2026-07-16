import { and, count, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { artifacts, courseDocuments, courses } from "@/lib/db/schema";
import type { AuthenticatedActor } from "@/lib/auth/authorization";

/** Courses the actor owns, most recently created first. Org-scoped. */
export async function listCoursesForActor(actor: AuthenticatedActor) {
  const db = getDb();
  return db
    .select()
    .from(courses)
    .where(
      and(eq(courses.organizationId, actor.organizationId), eq(courses.ownerUserId, actor.userId)),
    )
    .orderBy(desc(courses.createdAt));
}

/** Document/artifact counts for a course's "data usage" view (T1.1.4). */
export async function getCourseDataUsage(courseId: string) {
  const db = getDb();
  const [[documentCount], [artifactCount]] = await Promise.all([
    db
      .select({ value: count() })
      .from(courseDocuments)
      .where(eq(courseDocuments.courseId, courseId)),
    db.select({ value: count() }).from(artifacts).where(eq(artifacts.courseId, courseId)),
  ]);
  return {
    documentCount: documentCount.value,
    artifactCount: artifactCount.value,
  };
}
