import { integer, jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { courses } from "./courses";

export const courseProfiles = pgTable("course_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id")
    .notNull()
    .unique()
    .references(() => courses.id, { onDelete: "cascade" }),
  learningObjectives: jsonb("learning_objectives"),
  instructionStyle: jsonb("instruction_style"),
  assignmentPatterns: jsonb("assignment_patterns"),
  rubricPatterns: jsonb("rubric_patterns"),
  communicationTone: jsonb("communication_tone"),
  difficultyProfile: jsonb("difficulty_profile"),
  formatPreferences: jsonb("format_preferences"),
  confidenceByField: jsonb("confidence_by_field"),
  sourceDocumentIds: jsonb("source_document_ids"),
  version: integer("version").notNull().default(1),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
