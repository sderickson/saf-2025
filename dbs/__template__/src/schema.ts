import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Example table - replace with your own schema
export const examples = sqliteTable("examples", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
