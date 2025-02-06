import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// All tables should be defined here. Alternatively if this document becomes too long,
// tables can be defined in separate files in a `schemas` directory.
export const exampleTable = sqliteTable("examples", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
