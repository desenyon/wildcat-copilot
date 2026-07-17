"use server";

import { and, asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db/client";
import { courseDocuments, courseProfiles, documentChunks } from "@/lib/db/schema";
import { requireActor, requireCourseAccess } from "@/lib/auth/authorization";
import { synthesizeCourseProfile, type DocumentInput } from "./synthesize";

const FIELD_KEYS = [
  "learningObjectives",
  "instructionStyle",
  "assignmentPatterns",
  "rubricPatterns",
  "communicationTone",
  "difficultyProfile",
  "formatPreferences",
] as const;

export type ProfileFieldKey = (typeof FIELD_KEYS)[number];

/**
 * Recomputes every profile field that hasn't been explicitly overridden by
 * the teacher (confidence === 1 means "locked" — see updateCourseProfileFieldAction).
 * This is how teacher corrections survive re-synthesis (AGENTS.md acceptance
 * criterion: "Teacher corrections override inferred values").
 */
export async function synthesizeCourseProfileAction(courseId: string) {
  const actor = await requireActor();
  await requireCourseAccess(courseId, actor);
  const db = getDb();

  const docs = await db
    .select({ id: courseDocuments.id, documentType: courseDocuments.documentType })
    .from(courseDocuments)
    .where(
      and(
        eq(courseDocuments.courseId, courseId),
        eq(courseDocuments.processingStatus, "processed"),
      ),
    );

  const inputs: DocumentInput[] = [];
  for (const doc of docs) {
    const chunks = await db
      .select({ text: documentChunks.text })
      .from(documentChunks)
      .where(eq(documentChunks.courseDocumentId, doc.id))
      .orderBy(asc(documentChunks.sequenceNumber));
    inputs.push({
      id: doc.id,
      documentType: doc.documentType,
      text: chunks.map((c) => c.text).join("\n\n"),
    });
  }

  const synthesized = synthesizeCourseProfile(inputs);

  const existing = await db.query.courseProfiles.findFirst({
    where: eq(courseProfiles.courseId, courseId),
  });
  const existingConfidence = (existing?.confidenceByField as Record<string, number> | null) ?? {};
  const existingSources = (existing?.sourceDocumentIds as Record<string, string[]> | null) ?? {};

  const newValues: Record<ProfileFieldKey, unknown> = {} as Record<ProfileFieldKey, unknown>;
  const newConfidence: Record<string, number> = { ...existingConfidence };
  const newSources: Record<string, string[]> = { ...existingSources };

  for (const key of FIELD_KEYS) {
    const isLocked = (existingConfidence[key] ?? 0) >= 1;
    if (isLocked && existing) {
      newValues[key] = (existing as unknown as Record<string, unknown>)[key];
      continue;
    }
    const observation = synthesized[key];
    newValues[key] = observation.value;
    newConfidence[key] = observation.confidence;
    newSources[key] = observation.sourceDocumentIds;
  }

  if (existing) {
    await db
      .update(courseProfiles)
      .set({
        ...newValues,
        confidenceByField: newConfidence,
        sourceDocumentIds: newSources,
        version: existing.version + 1,
        updatedAt: new Date(),
      })
      .where(eq(courseProfiles.id, existing.id));
  } else {
    await db.insert(courseProfiles).values({
      courseId,
      ...newValues,
      confidenceByField: newConfidence,
      sourceDocumentIds: newSources,
      version: 1,
    });
  }

  revalidatePath("/course-profile");
}

/** Teacher correction (T1.2.6): always locks the field's confidence to 1.0. */
export async function updateCourseProfileFieldAction(
  courseId: string,
  field: ProfileFieldKey,
  value: unknown,
) {
  const actor = await requireActor();
  await requireCourseAccess(courseId, actor);
  const db = getDb();

  const existing = await db.query.courseProfiles.findFirst({
    where: eq(courseProfiles.courseId, courseId),
  });
  const confidenceByField = {
    ...((existing?.confidenceByField as Record<string, number> | null) ?? {}),
    [field]: 1,
  };

  if (existing) {
    await db
      .update(courseProfiles)
      .set({
        [field]: value,
        confidenceByField,
        version: existing.version + 1,
        updatedAt: new Date(),
      })
      .where(eq(courseProfiles.id, existing.id));
  } else {
    await db.insert(courseProfiles).values({
      courseId,
      [field]: value,
      confidenceByField,
      version: 1,
    });
  }

  revalidatePath("/course-profile");
}
