import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { vol } from "memfs";
import {
  // generateDockerfile,
  getMonorepoPackageJsons,
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
  it("should return the correct package.json", () => {
    const packageJsons = getMonorepoPackageJsons("/app");
    expect(packageJsons).toBeDefined();
    expect(packageJsons["@foo/foo"]).toBeDefined();
    expect(packageJsons["@foo/foo"].workspaces).toBeDefined();
    expect(packageJsons["@foo/foo"].workspaces.length).toBe(5);
  });
});
