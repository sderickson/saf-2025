import { describe, it, expect, beforeEach, vi } from "vitest";
import { fs, vol } from "memfs";
import {
  findRootDir,
  getInternalDependencies,
  readPackageJson,
  readProject,
  writePackageJson,
} from "../utils.ts";
import { makeIO, volumeJson } from "./mocks.ts";
import type { IO, PackageJson } from "../types.ts";
vi.mock("fs");

describe("utils", () => {
  let io: IO;
  beforeEach(() => {
    vol.fromJSON(volumeJson);
    vi.resetAllMocks();
    io = makeIO();
  });
  describe("findRootDir", () => {
    it("should find the root directory", () => {
      const result = findRootDir("/saf/package.json", io);
      expect(result).toBe("/saf");
    });
  });

  beforeEach(() => {});
  describe("readPackageJson", () => {
    it("should read and parse package.json", () => {
      const result = readPackageJson("/saf/package.json", io);
      expect(result).toBeDefined();
    });
    it("should handle errors gracefully", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      const result = readPackageJson("/saf/non-existent.json", io);
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
      writePackageJson("/saf/package.json", mockPackageJson, io);
      expect(fs.readFileSync("/saf/package.json", "utf8")).toEqual(
        JSON.stringify(mockPackageJson, null, 2) + "\n"
      );
    });
  });
  describe("readProject", () => {
    it("should find all workspace package.json files", () => {
      const result = readProject("/saf/package.json", io);
      expect(result.workspacePackages.size).toBe(3);
      expect(
        result.workspacePackages.get("/saf/services/api/package.json")
      ).toBeDefined();
      expect(
        result.workspacePackages.get("/saf/dbs/auth/package.json")
      ).toBeDefined();
    });
    it("should handle missing workspaces gracefully", () => {
      vol.fromJSON({
        "/saf/package.json": JSON.stringify({
          name: "root",
        }),
      });
      vi.spyOn(console, "error").mockImplementation(() => {});
      const result = readProject("/saf/package.json", io);
      expect(result.workspacePackages.size).toBe(0);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getInternalDependencies", () => {
    it("should find all internal dependencies", () => {
      const project = readProject("/saf/package.json", io);
      const result = getInternalDependencies(
        "/saf/services/api/package.json",
        project
      );
      expect(result.size).toBe(2);
      expect(result.get("/saf/dbs/auth/package.json")).toBeDefined();
      expect(result.get("/saf/lib/dbs/package.json")).toBeDefined();
    });
  });
});
