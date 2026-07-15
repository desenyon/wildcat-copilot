import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const userRoleEnum = pgEnum("user_role", [
  "teacher",
  "department_lead",
  "school_administrator",
  "technical_administrator",
  "support_operator",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  // Clerk is the identity provider; this is Clerk's `user_...` id, the join
  // key between a Clerk session and our own User row.
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  role: userRoleEnum("role").notNull().default("teacher"),
  authProvider: text("auth_provider").notNull().default("clerk"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true }).notNull().defaultNow(),
});
