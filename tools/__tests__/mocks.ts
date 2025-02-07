import { minimatch } from "minimatch";
import { vol, fs } from "memfs";
import { Context } from "../types.ts";
export const volumeJson = {
  "/saf/package.json": JSON.stringify({
    name: "@saf/saf-2025",
    workspaces: ["services/*", "dbs/*"],
  }),
  "/saf/services/api/package.json": JSON.stringify({
    name: "@saf/api",
    dependencies: {
      "@saf/auth-db": "1.0.0",
      express: "4.0.0",
    },
    files: ["src/**/*.ts", "package.json"],
  }),
  "/saf/services/api/docker-compose.yaml.template": JSON.stringify({
    services: {
      api: {
        build: {
          context: ".",
          dockerfile: "services/api/Dockerfile",
        },
        environment: {
          NODE_ENV: "development",
        },
      },
    },
  }),
  "/saf/dbs/auth/package.json": JSON.stringify({
    name: "@saf/auth-db",
    dependencies: {
      sqlite3: "5.0.0",
      "@saf/lib-dbs": "1.0.0",
    },
    files: ["src/**/*.ts", "package.json"],
  }),
  "/saf/lib/dbs/package.json": JSON.stringify({
    name: "@saf/lib-dbs",
  }),
};

vol.fromJSON(volumeJson);

export const allFiles = Object.keys(volumeJson);

export const globMock = (pattern: string) => {
  return allFiles.filter((file) => minimatch(file, pattern));
};

export const makeContext = (): Context => {
  return {
    startingPackage: "/saf/package.json",
    fs: {
      readFileSync: (string) => fs.readFileSync(string, "utf8").toString(),
      existsSync: (string) => fs.existsSync(string),
      writeFileSync: (string, content) => fs.writeFileSync(string, content),
    },
    glob: globMock,
    workspace: undefined,
  };
};
