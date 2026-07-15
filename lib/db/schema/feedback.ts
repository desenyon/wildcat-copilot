import { index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { artifacts, artifactVersions } from "./artifacts";
import { users } from "./users";

export const teacherFeedback = pgTable(
  "teacher_feedback",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    artifactId: uuid("artifact_id")
      .notNull()
      .references(() => artifacts.id, { onDelete: "cascade" }),
    artifactVersionId: uuid("artifact_version_id")
      .notNull()
      .references(() => artifactVersions.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: text("rating").notNull(),
    reasonCodes: jsonb("reason_codes"),
    freeText: text("free_text"),
    estimatedMinutesSaved: integer("estimated_minutes_saved"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("teacher_feedback_artifact_id_idx").on(table.artifactId)],
);
