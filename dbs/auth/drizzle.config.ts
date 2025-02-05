import { defineConfig } from "drizzle-kit";
import path from "path";
import { fileURLToPath } from "url";

const getDirname = () => {
  const __filename = fileURLToPath(import.meta.url);
  return path.dirname(__filename);
};

export const getDbPath = () => {
  return path.join(getDirname(), "data/users.sqlite");
};

export const getMigrationsPath = () => {
  return path.join(getDirname(), "./migrations");
};

export default defineConfig({
  out: "./migrations",
  schema: "./src/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "./data/users.sqlite",
  },
});
