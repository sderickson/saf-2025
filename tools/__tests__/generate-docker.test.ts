import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";
import {
  createWorkspaceContext,
  generateDockerfile,
  generateDockerCompose,
  WorkspaceInfo,
  WorkspaceContext,
} from "../generate-docker";
import * as utils from "../utils";

vi.mock("fs");
vi.mock("path");
vi.mock("yaml");
vi.mock("../utils");

describe("generate-docker", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("createWorkspaceContext", () => {
    it("should create context with workspaces and their dependencies", () => {
      const mockRootPackageJson = {
        name: "root",
        workspaces: ["services/*", "dbs/*"],
      };

      const mockApiPackage = {
        name: "@saf-2025/api",
        dependencies: {
          "@saf-2025/auth-db": "1.0.0",
          express: "4.0.0",
        },
      };

      const mockAuthDbPackage = {
        name: "@saf-2025/auth-db",
        dependencies: {
          sqlite3: "5.0.0",
        },
      };

      vi.spyOn(utils, "readPackageJson").mockImplementation((filePath) => {
        if (filePath === "package.json") return mockRootPackageJson;
        if (filePath.includes("services/api")) return mockApiPackage;
        if (filePath.includes("dbs/auth")) return mockAuthDbPackage;
        return { name: "" };
      });

      vi.spyOn(fs, "existsSync").mockImplementation((filePath) => {
        return String(filePath).endsWith("package.json");
      });

      vi.spyOn(path, "join").mockImplementation((...parts) => parts.join("/"));

      const context = createWorkspaceContext();
      const apiWorkspace = context.workspacePackages.get("@saf-2025/api");

      expect(apiWorkspace).toBeDefined();
      expect(apiWorkspace?.dependencies).toContain("@saf-2025/auth-db");
      expect(apiWorkspace?.dependencies).not.toContain("express");
    });

    it("should handle missing workspaces gracefully", () => {
      const mockRootPackageJson = {
        name: "root",
      };

      vi.spyOn(utils, "readPackageJson").mockReturnValue(mockRootPackageJson);
      vi.spyOn(console, "error").mockImplementation(() => {});

      const context = createWorkspaceContext();
      expect(context.workspacePackages.size).toBe(0);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("generateDockerfile", () => {
    let mockContext: WorkspaceContext;

    beforeEach(() => {
      mockContext = {
        rootPackageJson: { name: "root" },
        workspacePackages: new Map([
          [
            "@saf-2025/api",
            {
              name: "@saf-2025/api",
              path: "services/api",
              dependencies: ["@saf-2025/auth-db"],
              files: ["src/**/*.ts", "package.json"],
            },
          ],
          [
            "@saf-2025/auth-db",
            {
              name: "@saf-2025/auth-db",
              path: "dbs/auth",
              dependencies: [],
              files: ["src/**/*.ts", "package.json"],
            },
          ],
        ]),
      };
    });

    it("should generate correct Dockerfile content", () => {
      const workspace = mockContext.workspacePackages.get("@saf-2025/api")!;
      const dockerfile = generateDockerfile(workspace, mockContext);

      // Check basic structure
      expect(dockerfile).toContain("FROM node:22-slim");
      expect(dockerfile).toContain("WORKDIR /app");
      expect(dockerfile).toContain("COPY package*.json ./");
      expect(dockerfile).toContain("COPY tsconfig.json ./");

      // Check workspace-specific parts
      expect(dockerfile).toContain(
        "COPY services/api/package*.json ./services/api/"
      );
      expect(dockerfile).toContain(
        "COPY services/api/src/**/*.ts ./services/api/src/**/*.ts"
      );

      // Check dependency copying
      expect(dockerfile).toContain(
        "COPY dbs/auth/src/**/*.ts ./dbs/auth/src/**/*.ts"
      );

      // Check final setup
      expect(dockerfile).toContain("RUN npm install");
      expect(dockerfile).toContain('CMD ["npm", "start"]');
    });

    it("should handle workspaces without specific files", () => {
      const workspace: WorkspaceInfo = {
        name: "@saf-2025/api",
        path: "services/api",
        dependencies: [],
      };

      const dockerfile = generateDockerfile(workspace, mockContext);
      expect(dockerfile).toContain("COPY services/api ./services/api");
    });
  });

  describe("generateDockerCompose", () => {
    let mockContext: WorkspaceContext;

    beforeEach(() => {
      mockContext = {
        rootPackageJson: { name: "root" },
        workspacePackages: new Map([
          [
            "@saf-2025/api",
            {
              name: "@saf-2025/api",
              path: "services/api",
              dependencies: ["@saf-2025/auth-db"],
              files: ["src/**/*.ts"],
            },
          ],
          [
            "@saf-2025/auth-db",
            {
              name: "@saf-2025/auth-db",
              path: "dbs/auth",
              dependencies: [],
              files: ["src/**/*.ts"],
            },
          ],
        ]),
      };
    });

    it("should generate docker-compose with watch paths", () => {
      const workspace = mockContext.workspacePackages.get("@saf-2025/api")!;

      vi.spyOn(fs, "existsSync").mockReturnValue(false);
      vi.spyOn(yaml, "stringify").mockReturnValue("mocked yaml content");

      const compose = generateDockerCompose(workspace, mockContext);

      expect(compose).toBe("mocked yaml content");
      expect(yaml.stringify).toHaveBeenCalledWith(
        expect.objectContaining({
          services: expect.objectContaining({
            "@saf-2025/api": expect.objectContaining({
              develop: expect.objectContaining({
                watch: expect.arrayContaining([
                  expect.objectContaining({
                    action: "sync+restart",
                    path: ".",
                    target: "/app/services/api",
                  }),
                ]),
              }),
            }),
          }),
        })
      );
    });

    it("should use existing template if available", () => {
      const workspace = mockContext.workspacePackages.get("@saf-2025/api")!;
      const mockTemplate = {
        services: {
          "@saf-2025/api": {
            build: {
              context: ".",
              dockerfile: "services/api/Dockerfile",
            },
            environment: {
              NODE_ENV: "development",
            },
          },
        },
      };

      vi.spyOn(fs, "existsSync").mockReturnValue(true);
      vi.spyOn(fs, "readFileSync").mockReturnValue(
        JSON.stringify(mockTemplate)
      );
      vi.spyOn(yaml, "parse").mockReturnValue(mockTemplate);
      vi.spyOn(yaml, "stringify").mockReturnValue("mocked yaml content");

      const compose = generateDockerCompose(workspace, mockContext);

      expect(compose).toBe("mocked yaml content");
      expect(yaml.stringify).toHaveBeenCalledWith(
        expect.objectContaining({
          services: expect.objectContaining({
            "@saf-2025/api": expect.objectContaining({
              environment: {
                NODE_ENV: "development",
              },
            }),
          }),
        })
      );
    });

    it("should handle template parsing errors", () => {
      const workspace = mockContext.workspacePackages.get("@saf-2025/api")!;

      vi.spyOn(fs, "existsSync").mockReturnValue(true);
      vi.spyOn(fs, "readFileSync").mockImplementation(() => {
        throw new Error("Failed to read template");
      });
      vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => generateDockerCompose(workspace, mockContext)).toThrow();
      expect(console.error).toHaveBeenCalled();
    });
  });
});
