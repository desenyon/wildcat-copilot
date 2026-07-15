import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { artifacts, artifactVersions } from "./artifacts";
import { users } from "./users";

export const exportRecords = pgTable(
  "export_records",
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
    exportType: text("export_type").notNull(),
    destinationMetadata: jsonb("destination_metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("export_records_artifact_id_idx").on(table.artifactId)],
);
