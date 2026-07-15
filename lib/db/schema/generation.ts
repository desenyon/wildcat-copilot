import { index, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { courses } from "./courses";
import { users } from "./users";

export const generationStatusEnum = pgEnum("generation_status", [
  "pending",
  "planning",
  "generating",
  "completed",
  "failed",
  "partial",
]);

export const generationRequests = pgTable(
  "generation_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    requestedByUserId: uuid("requested_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    generationType: text("generation_type").notNull(),
    inputPayload: jsonb("input_payload").notNull(),
    status: generationStatusEnum("status").notNull().default("pending"),
    modelProvider: text("model_provider"),
    modelName: text("model_name"),
    promptVersion: text("prompt_version"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    errorCode: text("error_code"),
    costMetadata: jsonb("cost_metadata"),
    idempotencyKey: text("idempotency_key").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("generation_requests_course_id_idx").on(table.courseId)],
);
