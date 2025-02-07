import { describe, it, expect, beforeEach, vi } from "vitest";
import { fs, vol } from "memfs";
import { findRootDir, readPackageJson } from "../utils.ts";
import { globMock, volumeJson } from "./mocks.ts";
import type { Context } from "../types.ts";
vi.mock("fs");

describe("utils", () => {
  let ctx: Context;
  beforeEach(() => {
    vol.fromJSON(volumeJson);
    vi.resetAllMocks();
    ctx = {
      startingPackage: "/app/package.json",
      fs: {
        readFileSync: (string) => fs.readFileSync(string, "utf8").toString(),
        existsSync: (string) => fs.existsSync(string),
      },
      glob: globMock,
      workspace: undefined,
    };
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
  // // describe("writePackageJson", () => {
  // //   it("should write formatted package.json", () => {
  // //     const mockPackageJson: PackageJson = {
  // //       name: "test-package",
  // //       dependencies: { "dep-1": "1.0.0" },
  // //     };
  // //     const writeFileSpy = vi
  // //       .spyOn(fs, "writeFileSync")
  // //       .mockImplementation(() => {});
  // //     writePackageJson("package.json", mockPackageJson);
  // //     expect(writeFileSpy).toHaveBeenCalledWith(
  // //       "package.json",
  // //       JSON.stringify(mockPackageJson, null, 2) + "\n"
  // //     );
  // //   });
  // // });
  // // describe("findWorkspacePackageJsons", () => {
  // //   it("should find all workspace package.json files", () => {
  // //     const mockRootPackageJson: PackageJson = {
  // //       name: "root",
  // //       workspaces: ["packages/*", "tools"],
  // //     };
  // //     vi.spyOn(fs, "readFileSync").mockImplementation((filePath) => {
  // //       if (filePath === "package.json") {
  // //         return JSON.stringify(mockRootPackageJson);
  // //       }
  // //       return "{}";
  // //     });
  // //     vi.spyOn(glob, "sync").mockReturnValue(["packages/package.json"]);
  // //     vi.spyOn(fs, "existsSync").mockImplementation((filePath) => {
  // //       return String(filePath).endsWith("package.json");
  // //     });
  // //     const result = findWorkspacePackageJsons();
  // //     expect(result).toContain("packages/package.json");
  // //     expect(result).toContain("tools/package.json");
  // //   });
  // //   it("should handle missing workspaces gracefully", () => {
  // //     const mockRootPackageJson: PackageJson = {
  // //       name: "root",
  // //     };
  // //     vi.spyOn(fs, "readFileSync").mockReturnValue(
  // //       JSON.stringify(mockRootPackageJson)
  // //     );
  // //     vi.spyOn(console, "error").mockImplementation(() => {});
  // //     const result = findWorkspacePackageJsons();
  // //     expect(result).toEqual([]);
  // //     expect(console.error).toHaveBeenCalled();
  // //   });
  // });
});
