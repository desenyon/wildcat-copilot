import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { courses } from "./courses";
import { users } from "./users";

// Matches embedding dimension for the chosen provider's embedding model.
// Revisit this constant alongside the model choice in docs/DECISIONS.md.
export const EMBEDDING_DIMENSIONS = 1536;

export const documentTypeEnum = pgEnum("document_type", [
  "syllabus",
  "assignment",
  "rubric",
  "lesson_plan",
  "slide_deck",
  "reading",
  "assessment",
  "department_standard",
  "other",
]);

export const processingStatusEnum = pgEnum("processing_status", [
  "pending",
  "processing",
  "processed",
  "failed",
]);

export const courseDocuments = pgTable(
  "course_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    uploadedByUserId: uuid("uploaded_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    documentType: documentTypeEnum("document_type").notNull().default("other"),
    // Confidence in `documentType`: null = not yet classified, <1 = system
    // suggestion (T1.2.3), 1.0 = explicit teacher choice/override.
    documentTypeConfidence: real("document_type_confidence"),
    mimeType: text("mime_type").notNull(),
    storageKey: text("storage_key").notNull(),
    checksum: text("checksum").notNull(),
    processingStatus: processingStatusEnum("processing_status").notNull().default("pending"),
    processingErrorCode: text("processing_error_code"),
    containsStudentData: boolean("contains_student_data").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("course_documents_course_id_idx").on(table.courseId),
    index("course_documents_checksum_idx").on(table.checksum),
  ],
);

export const documentChunks = pgTable(
  "document_chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseDocumentId: uuid("course_document_id")
      .notNull()
      .references(() => courseDocuments.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    sequenceNumber: integer("sequence_number").notNull(),
    text: text("text").notNull(),
    embedding: vector("embedding", { dimensions: EMBEDDING_DIMENSIONS }),
    pageNumber: integer("page_number"),
    sectionTitle: text("section_title"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("document_chunks_course_id_idx").on(table.courseId),
    index("document_chunks_course_document_id_idx").on(table.courseDocumentId),
  ],
);
