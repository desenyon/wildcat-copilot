import { z } from "zod";
import { ALLOWED_UPLOAD_MIME_TYPES, MAX_UPLOAD_BYTES } from "@/lib/documents/storage/types";

export const requestUploadSchema = z.object({
  courseId: z.string().uuid(),
  filename: z.string().trim().min(1).max(300),
  mimeType: z.enum(ALLOWED_UPLOAD_MIME_TYPES),
  sizeBytes: z.number().int().positive().max(MAX_UPLOAD_BYTES),
  documentType: z.enum([
    "syllabus",
    "assignment",
    "rubric",
    "lesson_plan",
    "slide_deck",
    "reading",
    "assessment",
    "department_standard",
    "other",
  ]),
  confirmedNoStudentData: z.literal(true, {
    error: "You must confirm this file does not contain identifiable student data.",
  }),
});

export type RequestUploadInput = z.infer<typeof requestUploadSchema>;
