import { minimatch } from "minimatch";
import { vol } from "memfs";
export const volumeJson = {
  "/app/package.json": JSON.stringify({
    name: "@saf/saf-2025",
    workspaces: ["services/*", "dbs/*"],
  }),
  "/app/services/api/package.json": JSON.stringify({
    name: "@saf/api",
    dependencies: {
      "@saf/auth-db": "1.0.0",
      express: "4.0.0",
    },
    files: ["src/**/*.ts", "package.json"],
  }),
  "/app/dbs/auth/package.json": JSON.stringify({
    name: "@saf/auth-db",
    dependencies: {
      sqlite3: "5.0.0",
    },
    files: ["src/**/*.ts", "package.json"],
  }),
};

vol.fromJSON(volumeJson);

export const allFiles = Object.keys(volumeJson);

export const globMock = (pattern: string) => {
  return allFiles.filter((file) => minimatch(file, pattern));
};
