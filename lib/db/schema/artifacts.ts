import { index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { courses } from "./courses";
import { generationRequests } from "./generation";
import { users } from "./users";

export const artifactTypeEnum = pgEnum("artifact_type", [
  "lesson_sequence",
  "assignment",
  "rubric",
  "formative_assessment",
  "canvas_announcement",
  "differentiation_options",
]);

export const artifactStatusEnum = pgEnum("artifact_status", [
  "draft",
  "needs_review",
  "approved",
  "exported",
  "archived",
]);

export const artifacts = pgTable(
  "artifacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    generationRequestId: uuid("generation_request_id").references(() => generationRequests.id, {
      onDelete: "set null",
    }),
    artifactType: artifactTypeEnum("artifact_type").notNull(),
    title: text("title").notNull(),
    contentJson: jsonb("content_json").notNull(),
    contentText: text("content_text").notNull(),
    status: artifactStatusEnum("status").notNull().default("draft"),
    // References artifact_versions.id. FK added via a separate ALTER in migrations
    // to avoid a circular table-definition dependency (artifact_versions -> artifacts).
    currentVersionId: uuid("current_version_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("artifacts_course_id_idx").on(table.courseId)],
);

export const artifactCreatedByEnum = pgEnum("artifact_created_by", ["model", "teacher"]);

export const artifactVersions = pgTable(
  "artifact_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    artifactId: uuid("artifact_id")
      .notNull()
      .references(() => artifacts.id, { onDelete: "cascade" }),
    versionNumber: integer("version_number").notNull(),
    contentJson: jsonb("content_json").notNull(),
    contentText: text("content_text").notNull(),
    createdByType: artifactCreatedByEnum("created_by_type").notNull(),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    changeSummary: text("change_summary"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("artifact_versions_artifact_id_idx").on(table.artifactId)],
);
