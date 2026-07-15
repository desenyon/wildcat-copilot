import { index, pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { artifactVersions } from "./artifacts";
import { courseDocuments, documentChunks } from "./documents";

export const sourceCitations = pgTable(
  "source_citations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    artifactVersionId: uuid("artifact_version_id")
      .notNull()
      .references(() => artifactVersions.id, { onDelete: "cascade" }),
    courseDocumentId: uuid("course_document_id")
      .notNull()
      .references(() => courseDocuments.id, { onDelete: "cascade" }),
    documentChunkId: uuid("document_chunk_id")
      .notNull()
      .references(() => documentChunks.id, { onDelete: "cascade" }),
    artifactSectionId: text("artifact_section_id").notNull(),
    relevanceScore: real("relevance_score"),
    quotedExcerpt: text("quoted_excerpt").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("source_citations_artifact_version_id_idx").on(table.artifactVersionId)],
);
