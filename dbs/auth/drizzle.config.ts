import { defineConfig } from "drizzle-kit";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const dbPath = path.join(__dirname, "data/users.sqlite");
export const migrationsPath = path.join(__dirname, "./migrations");

export default defineConfig({
  out: migrationsPath,
  schema: "./src/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: dbPath,
  },
});
