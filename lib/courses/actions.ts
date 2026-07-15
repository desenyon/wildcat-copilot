"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db/client";
import { courses } from "@/lib/db/schema";
import { requireActor } from "@/lib/auth/authorization";
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
