"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db/client";
import { courses } from "@/lib/db/schema";
import { requireActor, requireCourseAccess } from "@/lib/auth/authorization";
import { createCourseSchema } from "./schema";

type CreateCourseFieldErrors = Partial<
  Record<
    | "name"
    | "subject"
    | "gradeBand"
    | "academicTerm"
    | "defaultClassDurationMinutes"
    | "description",
    string
  >
>;

export interface CreateCourseFormState {
  errors?: CreateCourseFieldErrors;
  saved?: boolean;
}

function formEntries(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    gradeBand: String(formData.get("gradeBand") ?? ""),
    academicTerm: String(formData.get("academicTerm") ?? ""),
    defaultClassDurationMinutes: String(formData.get("defaultClassDurationMinutes") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
}

export async function createCourseAction(
  _prevState: CreateCourseFormState,
  formData: FormData,
): Promise<CreateCourseFormState> {
  const actor = await requireActor();
  const parsed = createCourseSchema.safeParse(formEntries(formData));

  if (!parsed.success) {
    const errors: CreateCourseFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof CreateCourseFieldErrors | undefined;
      if (key) errors[key] = issue.message;
    }
    return { errors };
  }

  const db = getDb();
  const [course] = await db
    .insert(courses)
    .values({
      organizationId: actor.organizationId,
      ownerUserId: actor.userId,
      name: parsed.data.name,
      subject: parsed.data.subject,
      gradeBand: parsed.data.gradeBand,
      academicTerm: parsed.data.academicTerm,
      defaultClassDurationMinutes: parsed.data.defaultClassDurationMinutes,
      description: parsed.data.description ?? null,
    })
    .returning();

  revalidatePath("/", "layout");
  redirect(`/home?course=${course.id}`);
}

export async function updateCourseAction(
  courseId: string,
  _prevState: CreateCourseFormState,
  formData: FormData,
): Promise<CreateCourseFormState> {
  const actor = await requireActor();
  await requireCourseAccess(courseId, actor);

  const parsed = createCourseSchema.safeParse(formEntries(formData));
  if (!parsed.success) {
    const errors: CreateCourseFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof CreateCourseFieldErrors | undefined;
      if (key) errors[key] = issue.message;
    }
    return { errors };
  }

  const db = getDb();
  await db
    .update(courses)
    .set({
      name: parsed.data.name,
      subject: parsed.data.subject,
      gradeBand: parsed.data.gradeBand,
      academicTerm: parsed.data.academicTerm,
      defaultClassDurationMinutes: parsed.data.defaultClassDurationMinutes,
      description: parsed.data.description ?? null,
    })
    .where(eq(courses.id, courseId));

  revalidatePath("/", "layout");
  return { saved: true };
}

/**
 * Hard-deletes a course and everything that cascades from it (documents,
 * artifacts, generation requests, ...) per AGENTS.md §4.7 "clear course
 * deletion controls". Confirmation is enforced client-side via ConfirmDialog
 * before this is ever called.
 */
export async function deleteCourseAction(courseId: string): Promise<void> {
  const actor = await requireActor();
  await requireCourseAccess(courseId, actor);

  const db = getDb();
  await db.delete(courses).where(eq(courses.id, courseId));

  revalidatePath("/", "layout");
  redirect("/home");
}
