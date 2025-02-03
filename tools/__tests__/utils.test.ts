import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  PackageJson,
  readPackageJson,
  writePackageJson,
  findWorkspacePackageJsons,
} from "../utils";

vi.mock("fs");
vi.mock("path");

describe("utils", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("readPackageJson", () => {
    it("should read and parse package.json", () => {
      const mockPackageJson: PackageJson = {
        name: "test-package",
        dependencies: { "dep-1": "1.0.0" },
      };
      vi.spyOn(fs, "readFileSync").mockReturnValue(
        JSON.stringify(mockPackageJson)
      );

      const result = readPackageJson("package.json");
      expect(result).toEqual(mockPackageJson);
      expect(fs.readFileSync).toHaveBeenCalledWith("package.json", "utf8");
    });

    it("should handle errors gracefully", () => {
      vi.spyOn(fs, "readFileSync").mockImplementation(() => {
        throw new Error("File not found");
      });
      vi.spyOn(console, "error").mockImplementation(() => {});

      const result = readPackageJson("non-existent.json");
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
      const writeFileSpy = vi
        .spyOn(fs, "writeFileSync")
        .mockImplementation(() => {});

      writePackageJson("package.json", mockPackageJson);

      expect(writeFileSpy).toHaveBeenCalledWith(
        "package.json",
        JSON.stringify(mockPackageJson, null, 2) + "\n"
      );
    });
  });

  describe("findWorkspacePackageJsons", () => {
    it("should find all workspace package.json files", () => {
      const mockRootPackageJson: PackageJson = {
        name: "root",
        workspaces: ["packages/*", "tools"],
      };

      vi.spyOn(fs, "readFileSync").mockImplementation((filePath) => {
        if (filePath === "package.json") {
          return JSON.stringify(mockRootPackageJson);
        }
        return "{}";
      });

      vi.spyOn(fs, "existsSync").mockImplementation((filePath) => {
        return String(filePath).endsWith("package.json");
      });

      vi.spyOn(path, "join").mockImplementation((...parts) => parts.join("/"));

      const result = findWorkspacePackageJsons();
      expect(result).toContain("packages/package.json");
      expect(result).toContain("tools/package.json");
    });

    it("should handle missing workspaces gracefully", () => {
      const mockRootPackageJson: PackageJson = {
        name: "root",
      };

      vi.spyOn(fs, "readFileSync").mockReturnValue(
        JSON.stringify(mockRootPackageJson)
      );
      vi.spyOn(console, "error").mockImplementation(() => {});

      const result = findWorkspacePackageJsons();
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
