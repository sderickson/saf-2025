import { describe, it, expect, beforeEach, vi } from "vitest";
import { vol } from "memfs";
import { readProject } from "../utils.ts";
import { generateDockerfile } from "../generate-docker.ts";
import { makeIO, volumeJson } from "./mocks.ts";
import type { IO, PackageJson, Project } from "../types.ts";

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

// describe("generateDockerCompose", () => {
//   it("should generate docker-compose with watch paths", () => {
//     const context = addWorkspaceContext("/saf/package.json", ctx);
//     const workspace = context.workspace?.workspacePackages.get("@saf/api")!;
//     const compose = generateDockerCompose(workspace, context.workspace!);
//     const parsed = yaml.parse(compose);
//     expect(parsed.services.api.develop.watch).toContainEqual({
//       action: "sync+restart",
//       path: ".",
//       target: "/saf/services/api",
//     });
//   });
//   // it("should use existing template if available", () => {
//   //   const workspace = mockContext.workspacePackages.get("@saf/api")!;
//   //   const compose = generateDockerCompose(workspace, mockContext);
//   //   const parsed = yaml.parse(compose);
//   //   expect(parsed.services.api.environment).toEqual({
//   //     NODE_ENV: "development",
//   //   });
//   // });
//   // it("should handle template parsing errors", () => {
//   //   const workspace = mockContext.workspacePackages.get("@saf/api")!;
//   //   // Write invalid YAML to template
//   //   vol.writeFileSync(
//   //     "/app/services/api/docker-compose.yaml.template",
//   //     "invalid: yaml: content"
//   //   );
//   //   expect(() => generateDockerCompose(workspace, mockContext)).toThrow();
//   // });
// });
