import { z } from "zod";

export const createCourseSchema = z.object({
  name: z.string().trim().min(1, "Course name is required").max(200),
  subject: z.string().trim().min(1, "Subject is required").max(100),
  gradeBand: z.string().trim().min(1, "Grade band is required").max(50),
  academicTerm: z.string().trim().min(1, "Academic term is required").max(100),
  defaultClassDurationMinutes: z.coerce.number().int().min(5).max(300),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
