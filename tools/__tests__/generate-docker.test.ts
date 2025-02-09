import { describe, it, expect, beforeEach, vi } from "vitest";
import { vol } from "memfs";
import { readProject } from "../utils.ts";
import {
  generateDockerCompose,
  generateDockerfile,
} from "../generate-docker.ts";
import { makeIO, volumeJson } from "./mocks.ts";
import type { IO, PackageJson, Project } from "../types.ts";
import * as yaml from "yaml";

describe("generate-docker", () => {
  let io: IO;
  beforeEach(() => {
    vol.fromJSON(volumeJson);
    io = makeIO();
  });

  describe("createWorkspaceContext", () => {
    it("should create context with workspaces and their dependencies", () => {
      const project = readProject("/saf/package.json", io);
      const apiWorkspace = project.workspacePackages.get(
        "/saf/services/api/package.json"
      );
      expect(apiWorkspace).toBeDefined();
      expect(apiWorkspace?.dependencies?.["@saf/auth-db"]).toBeDefined();
      expect(apiWorkspace?.dependencies?.["express"]).toBeDefined();
    });

    it("should handle missing workspaces gracefully", () => {
      // Update the root package.json to have no workspaces
      vol.writeFileSync("/saf/package.json", JSON.stringify({ name: "root" }));

      vi.spyOn(console, "error").mockImplementation(() => {});

      const project = readProject("/saf/package.json", io);
      expect(project.workspacePackages.size).toBe(0);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("generateDockerfile", () => {
    it("should generate correct Dockerfile content", () => {
      const project = readProject("/saf/package.json", io);
      const dockerfile = generateDockerfile("/saf/services/api/package.json", {
        project,
        io,
      });

      expect(dockerfile).toContain("FROM node:22-slim");
      expect(dockerfile).toContain("WORKDIR /app");
      expect(dockerfile).toContain("COPY package*.json ./");
      expect(dockerfile).toContain("COPY tsconfig.json ./");
      expect(dockerfile).toContain(
        "COPY services/api/package*.json ./services/api/"
      );
      expect(dockerfile).toContain(
        "COPY services/api/src/**/*.ts ./services/api/src/**/*.ts"
      );
      expect(dockerfile).toContain(
        "COPY dbs/auth/src/**/*.ts ./dbs/auth/src/**/*.ts"
      );
      expect(dockerfile).toContain("COPY lib/dbs ./lib/dbs");
      expect(dockerfile).toContain("RUN npm install");
      expect(dockerfile).toContain('CMD ["npm", "start"]');
    });
  });

  it("should handle workspaces without specific files", () => {
    const rootPackageJson: PackageJson = {
      name: "@saf/saf-2025",
    };
    const project: Project = {
      rootDir: "/saf",
      workspacePackages: new Map([
        ["/saf/services/api/package.json", rootPackageJson],
      ]),
      rootPackageJson,
    };

    const dockerfile = generateDockerfile("/saf/services/api/package.json", {
      project,
      io,
    });
    expect(dockerfile).toContain("COPY services/api ./services/api");
  });
});

describe("generateDockerCompose", () => {
  let io: IO;
  beforeEach(() => {
    vol.fromJSON(volumeJson);
    io = makeIO();
  });

  it("should generate docker-compose with watch paths", () => {
    const project = readProject("/saf/package.json", io);
    const compose = generateDockerCompose("/saf/services/api/package.json", {
      project,
      io,
    });
    const parsed = yaml.parse(compose);
    expect(parsed.services.api.develop.watch).toContainEqual({
      action: "sync+restart",
      path: ".",
      target: "/app/services/api",
    });
  });
  it("should use existing template if available", () => {
    const project = readProject("/saf/package.json", io);
    const compose = generateDockerCompose("/saf/services/api/package.json", {
      project,
      io,
    });
    const parsed = yaml.parse(compose);
    expect(parsed.services.api.environment).toContainEqual("PORT=4000");
  });
  it("should handle template parsing errors", () => {
    const project = readProject("/saf/package.json", io);
    vol.writeFileSync(
      "/saf/services/api/docker-compose.yaml.template",
      "invalid: yaml: content"
    );
    expect(() =>
      generateDockerCompose("/saf/services/api/package.json", {
        project,
        io,
      })
    ).toThrow();
  });
  it("should add default environment variables if not already set", () => {
    const project = readProject("/saf/package.json", io);
    const compose = generateDockerCompose("/saf/services/api/package.json", {
      project,
      io,
    });
    const parsed = yaml.parse(compose);
    expect(parsed.services.api.environment).toContainEqual(
      "NODE_ENV=development"
    );
  });
  it("should set build context if not set", () => {
    const project = readProject("/saf/package.json", io);
    const compose = generateDockerCompose("/saf/services/api/package.json", {
      project,
      io,
    });
    const parsed = yaml.parse(compose);
    expect(parsed.services.api.build.context).toBe("../..");
  });
});
