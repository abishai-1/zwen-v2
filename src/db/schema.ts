import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const enquiries = pgTable("enquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  services: text("services").array().notNull(),
  budget: text("budget"),
  timeline: text("timeline"),
  description: text("description").notNull(),
  links: text("links"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type NewEnquiry = typeof enquiries.$inferInsert;
