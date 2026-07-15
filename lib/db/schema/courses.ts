import { index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { users } from "./users";

export const courseStatusEnum = pgEnum("course_status", ["active", "archived"]);

export const courses = pgTable(
  "courses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    ownerUserId: uuid("owner_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    subject: text("subject").notNull(),
    gradeBand: text("grade_band").notNull(),
    academicTerm: text("academic_term").notNull(),
    description: text("description"),
    defaultClassDurationMinutes: integer("default_class_duration_minutes").notNull().default(50),
    status: courseStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("courses_organization_id_idx").on(table.organizationId),
    index("courses_owner_user_id_idx").on(table.ownerUserId),
  ],
);
