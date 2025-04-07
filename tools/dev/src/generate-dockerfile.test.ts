import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { vol } from "memfs";
import {
  // generateDockerfile,
  getMonorepoPackageJsons,
  buildWorkspaceDependencyGraph,
} from "./generate-dockerfile.ts";
import { monorepoPackageMock } from "./monorepo-package-mock.ts";
vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
  vol.fromJSON(monorepoPackageMock);
});

afterEach(() => {
  vol.reset();
});

// describe("generateDockerfile", () => {
//   it("should generate a Dockerfile", () => {
//     expect(true).toBe(true);
//   });
// });

// it("should return correct text", () => {
//   {
//     const path = "/hello-world.txt";
//     fs.writeFileSync(path, "hello world");

//     const text = generateDockerfile(path);
//     expect(text).toBe("hello world");
//   }

//   {
//     const path = "/app/package.json";
//     const text = generateDockerfile(path);
//     expect(text).toContain("@foo/foo");
//   }
// });

describe("getMonorepoPackageJsons", () => {
  it("should return all workspace packages", () => {
    const packageJsons = getMonorepoPackageJsons("/app");
    expect(packageJsons).toBeDefined();
    expect(packageJsons["@foo/foo"]).toBeDefined();
    expect(packageJsons["@foo/foo"].workspaces).toBeDefined();

    // it should gather specific packages listed in workspaces
    expect(packageJsons["@foo/main-db"]).toBeDefined();
    expect(
      packageJsons["@foo/main-db"].dependencies?.["third-party-lib"],
    ).toBeDefined();

    // it should gather packages in sub-folders
    expect(packageJsons["@foo/api-service"]).toBeDefined();
    expect(packageJsons["@saflib/node-express"]).toBeDefined();
  });
});

describe("buildWorkspaceDependencyGraph", () => {
  it("should return the correct dependency graph", () => {
    const dependencyGraph = buildWorkspaceDependencyGraph(
      getMonorepoPackageJsons("/app"),
    );
    expect(dependencyGraph).toBeDefined();
    expect(dependencyGraph["@foo/auth-web-client"]).toStrictEqual([
      "@saflib/vue-spa",
      "@saflib/auth-vue",
    ]);
  });
});
