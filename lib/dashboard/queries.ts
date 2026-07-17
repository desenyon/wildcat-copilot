import { and, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { artifacts, courseDocuments, exportRecords, teacherFeedback } from "@/lib/db/schema";
import { listCoursesForActor, getCourseDataUsage } from "@/lib/courses/queries";
import type { AuthenticatedActor } from "@/lib/auth/authorization";

export interface HomeDashboardData {
  courses: Awaited<ReturnType<typeof listCoursesForActor>>;
  courseUsage: Record<string, { documentCount: number; artifactCount: number }>;
  documentsNeedingAttention: (typeof courseDocuments.$inferSelect)[];
  artifactsNeedingReview: (typeof artifacts.$inferSelect)[];
  recentDocuments: (typeof courseDocuments.$inferSelect)[];
  recentExports: { id: string; exportType: string; createdAt: Date; artifactTitle: string }[];
  timeSavedMinutes: number;
}

/** Real (never mocked) queries scoped to the actor's own courses (T1.7.1). Tables backing
 * artifacts/exports/feedback are legitimately empty until M1.3+ generation ships — this
 * surfaces genuine empty states, not placeholder data. */
export async function getHomeDashboardData(actor: AuthenticatedActor): Promise<HomeDashboardData> {
  const db = getDb();
  const courses = await listCoursesForActor(actor);
  const courseIds = courses.map((c) => c.id);

  if (courseIds.length === 0) {
    return {
      courses: [],
      courseUsage: {},
      documentsNeedingAttention: [],
      artifactsNeedingReview: [],
      recentDocuments: [],
      recentExports: [],
      timeSavedMinutes: 0,
    };
  }

  const [
    documentsNeedingAttention,
    artifactsNeedingReview,
    recentDocuments,
    exportRows,
    feedbackRows,
    usageEntries,
  ] = await Promise.all([
    db
      .select()
      .from(courseDocuments)
      .where(
        and(
          inArray(courseDocuments.courseId, courseIds),
          eq(courseDocuments.processingStatus, "failed"),
        ),
      )
      .orderBy(desc(courseDocuments.updatedAt))
      .limit(5),
    db
      .select()
      .from(artifacts)
      .where(and(inArray(artifacts.courseId, courseIds), eq(artifacts.status, "needs_review")))
      .orderBy(desc(artifacts.updatedAt))
      .limit(5),
    db
      .select()
      .from(courseDocuments)
      .where(inArray(courseDocuments.courseId, courseIds))
      .orderBy(desc(courseDocuments.createdAt))
      .limit(5),
    db
      .select({
        id: exportRecords.id,
        exportType: exportRecords.exportType,
        createdAt: exportRecords.createdAt,
        artifactTitle: artifacts.title,
      })
      .from(exportRecords)
      .innerJoin(artifacts, eq(exportRecords.artifactId, artifacts.id))
      .where(inArray(artifacts.courseId, courseIds))
      .orderBy(desc(exportRecords.createdAt))
      .limit(5),
    db
      .select({ minutes: teacherFeedback.estimatedMinutesSaved })
      .from(teacherFeedback)
      .innerJoin(artifacts, eq(teacherFeedback.artifactId, artifacts.id))
      .where(inArray(artifacts.courseId, courseIds)),
    Promise.all(courses.map(async (c) => [c.id, await getCourseDataUsage(c.id)] as const)),
  ]);

  const timeSavedMinutes = feedbackRows.reduce((sum, r) => sum + (r.minutes ?? 0), 0);
  const courseUsage = Object.fromEntries(usageEntries);

  return {
    courses,
    courseUsage,
    documentsNeedingAttention,
    artifactsNeedingReview,
    recentDocuments,
    recentExports: exportRows,
    timeSavedMinutes,
  };
}
