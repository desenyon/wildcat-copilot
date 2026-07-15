import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { courses } from "@/lib/db/schema";
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
