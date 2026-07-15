import { index, jsonb, pgTable, real, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { courses } from "./courses";
import { users } from "./users";

export const teacherPreferences = pgTable(
  "teacher_preferences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" }),
    preferenceKey: text("preference_key").notNull(),
    preferenceValue: jsonb("preference_value").notNull(),
    confidence: real("confidence").notNull().default(0),
    evidenceCount: real("evidence_count").notNull().default(0),
    sourceType: text("source_type").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("teacher_preferences_user_id_idx").on(table.userId),
    unique("teacher_preferences_scope_key").on(table.userId, table.courseId, table.preferenceKey),
  ],
);
