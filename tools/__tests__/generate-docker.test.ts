import { describe, it, expect, beforeEach, vi } from "vitest";
import { vol } from "memfs";
import { addWorkspaceContext } from "../generate-docker.ts";
import { makeContext, volumeJson } from "./mocks.ts";
import type { Context } from "../types.ts";
describe("generate-docker", () => {
  let ctx: Context;
  beforeEach(() => {
    vol.fromJSON(volumeJson);
    ctx = makeContext();
  });

  describe("createWorkspaceContext", () => {
    it("should create context with workspaces and their dependencies", () => {
      const context = addWorkspaceContext("/app/package.json", ctx);
      console.log(context);
      const apiWorkspace = context.workspace?.workspacePackages.get("@saf/api");
      expect(apiWorkspace).toBeDefined();
      expect(apiWorkspace?.dependencies).toContain("@saf/auth-db");
      expect(apiWorkspace?.dependencies).not.toContain("express");
    });

    it("should handle missing workspaces gracefully", () => {
      // Update the root package.json to have no workspaces
      vol.writeFileSync("/app/package.json", JSON.stringify({ name: "root" }));

      vi.spyOn(console, "error").mockImplementation(() => {});

      const context = addWorkspaceContext("/app/package.json", ctx);
      expect(context.workspace?.workspacePackages.size).toBe(0);
      expect(console.error).toHaveBeenCalled();
    });
  });

  // describe("generateDockerfile", () => {
  //   let mockContext: WorkspaceContext;

  //   beforeEach(() => {
  //     mockContext = {
  //       rootPackageJson: { name: "root" },
  //       workspacePackages: new Map([
  //         [
  //           "@saf/api",
  //           {
  //             name: "@saf/api",
  //             path: "services/api",
  //             dependencies: ["@saf/auth-db"],
  //             files: ["src/**/*.ts", "package.json"],
  //           },
  //         ],
  //         [
  //           "@saf/auth-db",
  //           {
  //             name: "@saf/auth-db",
  //             path: "dbs/auth",
  //             dependencies: [],
  //             files: ["src/**/*.ts", "package.json"],
  //           },
  //         ],
  //       ]),
  //     };
  //   });

  //   it("should generate correct Dockerfile content", () => {
  //     const workspace = mockContext.workspacePackages.get("@saf/api")!;
  //     const dockerfile = generateDockerfile(workspace, mockContext);

  //     expect(dockerfile).toContain("FROM node:22-slim");
  //     expect(dockerfile).toContain("WORKDIR /app");
  //     expect(dockerfile).toContain("COPY package*.json ./");
  //     expect(dockerfile).toContain("COPY tsconfig.json ./");
  //     expect(dockerfile).toContain(
  //       "COPY services/api/package*.json ./services/api/"
  //     );
  //     expect(dockerfile).toContain(
  //       "COPY services/api/src/**/*.ts ./services/api/src/**/*.ts"
  //     );
  //     expect(dockerfile).toContain(
  //       "COPY dbs/auth/src/**/*.ts ./dbs/auth/src/**/*.ts"
  //     );
  //     expect(dockerfile).toContain("RUN npm install");
  //     expect(dockerfile).toContain('CMD ["npm", "start"]');
  //   });

  //   it("should handle workspaces without specific files", () => {
  //     const workspace: WorkspaceInfo = {
  //       name: "@saf/api",
  //       path: "services/api",
  //       dependencies: [],
  //     };

  //     const dockerfile = generateDockerfile(workspace, mockContext);
  //     expect(dockerfile).toContain("COPY services/api ./services/api");
  //   });
  // });

  // describe("generateDockerCompose", () => {
  //   let mockContext: WorkspaceContext;

  //   beforeEach(() => {
  //     mockContext = {
  //       rootPackageJson: { name: "root" },
  //       workspacePackages: new Map([
  //         [
  //           "@saf/api",
  //           {
  //             name: "@saf/api",
  //             path: "services/api",
  //             dependencies: ["@saf/auth-db"],
  //             files: ["src/**/*.ts"],
  //           },
  //         ],
  //         [
  //           "@saf/auth-db",
  //           {
  //             name: "@saf/auth-db",
  //             path: "dbs/auth",
  //             dependencies: [],
  //             files: ["src/**/*.ts"],
  //           },
  //         ],
  //       ]),
  //     };

  //     // Setup template file in memfs
  //     vol.writeFileSync(
  //       "services/api/docker-compose.yaml.template",
  //       yaml.stringify({
  //         services: {
  //           api: {
  //             build: {
  //               context: ".",
  //               dockerfile: "services/api/Dockerfile",
  //             },
  //             environment: {
  //               NODE_ENV: "development",
  //             },
  //           },
  //         },
  //       })
  //     );
  //   });

  //   it("should generate docker-compose with watch paths", () => {
  //     const workspace = mockContext.workspacePackages.get("@saf/api")!;
  //     const compose = generateDockerCompose(workspace, mockContext);
  //     const parsed = yaml.parse(compose);

  //     expect(parsed.services.api.develop.watch).toContainEqual({
  //       action: "sync+restart",
  //       path: ".",
  //       target: "/app/services/api",
  //     });
  //   });

  //   it("should use existing template if available", () => {
  //     const workspace = mockContext.workspacePackages.get("@saf/api")!;
  //     const compose = generateDockerCompose(workspace, mockContext);
  //     const parsed = yaml.parse(compose);

  //     expect(parsed.services.api.environment).toEqual({
  //       NODE_ENV: "development",
  //     });
  //   });

  //   it("should handle template parsing errors", () => {
  //     const workspace = mockContext.workspacePackages.get("@saf/api")!;

  //     // Write invalid YAML to template
  //     vol.writeFileSync(
  //       "services/api/docker-compose.yaml.template",
  //       "invalid: yaml: content"
  //     );

  //     expect(() => generateDockerCompose(workspace, mockContext)).toThrow();
  //   });
  // });
});
