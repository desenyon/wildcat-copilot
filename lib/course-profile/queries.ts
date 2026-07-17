import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { courseProfiles } from "@/lib/db/schema";

export async function getCourseProfile(courseId: string) {
  const db = getDb();
  return db.query.courseProfiles.findFirst({ where: eq(courseProfiles.courseId, courseId) });
}
