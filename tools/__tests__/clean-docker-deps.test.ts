import { describe, it, expect, beforeEach, vi } from "vitest";
import * as path from "path";
import { cleanAllPackageJsons, CleanResults } from "../clean-docker-deps";
import * as utils from "../utils";

vi.mock("path");
vi.mock("../utils");

describe("clean-docker-deps", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("cleanAllPackageJsons", () => {
    it("should clean all package.jsons except the specified one", () => {
      const mockPackageJsons = [
        "tools/package.json",
        "services/api/package.json",
        "services/auth/package.json",
      ];

      const mockToolsPackage = {
        name: "tools",
        devDependencies: {
          typescript: "5.0.0",
          vitest: "1.0.0",
          "other-dev-dep": "1.0.0",
        },
      };

      const mockApiPackage = {
        name: "api",
        devDependencies: {
          typescript: "5.0.0",
          jest: "29.0.0",
        },
      };

      const mockAuthPackage = {
        name: "auth",
        devDependencies: {
          typescript: "5.0.0",
          vitest: "1.0.0",
        },
      };

      vi.spyOn(path, "resolve").mockImplementation((p) => p);
      vi.spyOn(utils, "findWorkspacePackageJsons").mockReturnValue(
        mockPackageJsons
      );
      vi.spyOn(utils, "readPackageJson").mockImplementation((filePath) => {
        if (filePath === "tools/package.json") return mockToolsPackage;
        if (filePath === "services/api/package.json") return mockApiPackage;
        if (filePath === "services/auth/package.json") return mockAuthPackage;
        return { name: "" };
      });
      vi.spyOn(utils, "writePackageJson").mockImplementation(() => {});

      const results = cleanAllPackageJsons("tools/package.json", true);

      // Check tools package (should keep non-testing devDeps)
      const toolsResult = results.find(
        (r: CleanResults) => r.packageJsonPath === "tools/package.json"
      );
      expect(toolsResult?.changed).toBe(true);
      expect(toolsResult?.removedDevDeps).toContain("vitest");
      expect(toolsResult?.pkg.devDependencies?.typescript).toBe("5.0.0");
      expect(toolsResult?.pkg.devDependencies?.["other-dev-dep"]).toBe("1.0.0");

      // Check other packages (should remove all devDeps)
      const apiResult = results.find(
        (r: CleanResults) => r.packageJsonPath === "services/api/package.json"
      );
      expect(apiResult?.changed).toBe(true);
      expect(apiResult?.pkg.devDependencies).toBeUndefined();

      const authResult = results.find(
        (r: CleanResults) => r.packageJsonPath === "services/auth/package.json"
      );
      expect(authResult?.changed).toBe(true);
      expect(authResult?.pkg.devDependencies).toBeUndefined();
    });

    it("should not write changes in dry run mode", () => {
      const mockPackageJsons = ["tools/package.json"];
      const mockPackage = {
        name: "tools",
        devDependencies: {
          vitest: "1.0.0",
        },
      };

      vi.spyOn(path, "resolve").mockImplementation((p) => p);
      vi.spyOn(utils, "findWorkspacePackageJsons").mockReturnValue(
        mockPackageJsons
      );
      vi.spyOn(utils, "readPackageJson").mockReturnValue(mockPackage);
      const writePackageJsonSpy = vi.spyOn(utils, "writePackageJson");

      cleanAllPackageJsons("tools/package.json", true);

      expect(writePackageJsonSpy).not.toHaveBeenCalled();
    });
  });
});
