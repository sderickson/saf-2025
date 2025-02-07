import { describe, it, expect, beforeEach, vi } from "vitest";
import { fs, vol } from "memfs";
import {
  findRootDir,
  findWorkspacePackageJsons,
  readPackageJson,
  writePackageJson,
} from "../utils.ts";
import { makeContext, volumeJson } from "./mocks.ts";
import type { Context, PackageJson } from "../types.ts";
vi.mock("fs");

describe("utils", () => {
  let ctx: Context;
  beforeEach(() => {
    vol.fromJSON(volumeJson);
    vi.resetAllMocks();
    ctx = makeContext();
  });
  describe("findRootDir", () => {
    it("should find the root directory", () => {
      const result = findRootDir(ctx);
      expect(result).toBe("/app");
    });
  });

  beforeEach(() => {});
  describe("readPackageJson", () => {
    it("should read and parse package.json", () => {
      const result = readPackageJson("/app/package.json", ctx);
      expect(result).toBeDefined();
    });
    it("should handle errors gracefully", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      const result = readPackageJson("/app/non-existent.json", ctx);
      expect(result).toEqual({ name: "" });
      expect(console.error).toHaveBeenCalled();
    });
  });
  describe("writePackageJson", () => {
    it("should write formatted package.json", () => {
      const mockPackageJson: PackageJson = {
        name: "test-package",
        dependencies: { "dep-1": "1.0.0" },
      };
      writePackageJson("/app/package.json", mockPackageJson, ctx);
      expect(fs.readFileSync("/app/package.json", "utf8")).toEqual(
        JSON.stringify(mockPackageJson, null, 2) + "\n"
      );
    });
  });
  describe("findWorkspacePackageJsons", () => {
    it("should find all workspace package.json files", () => {
      const result = findWorkspacePackageJsons("/app/package.json", ctx);
      expect(result).toContain("/app/services/api/package.json");
      expect(result).toContain("/app/dbs/auth/package.json");
    });
    it("should handle missing workspaces gracefully", () => {
      vol.fromJSON({
        "/app/package.json": JSON.stringify({
          name: "root",
        }),
      });
      vi.spyOn(console, "error").mockImplementation(() => {});
      const result = findWorkspacePackageJsons("/app/package.json", ctx);
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
