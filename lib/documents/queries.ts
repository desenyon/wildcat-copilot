import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { courseDocuments } from "@/lib/db/schema";

export async function listDocumentsForCourse(courseId: string) {
  const db = getDb();
  return db
    .select()
    .from(courseDocuments)
    .where(eq(courseDocuments.courseId, courseId))
    .orderBy(desc(courseDocuments.createdAt));
}
