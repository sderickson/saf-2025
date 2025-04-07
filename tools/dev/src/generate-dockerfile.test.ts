import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fs, vol } from "memfs";
import { generateDockerfile } from "./generate-dockerfile.ts";
import { monorepoPackageMock } from "./monorepo-package-mock.ts";
vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
  vol.fromJSON(monorepoPackageMock);
});

afterEach(() => {
  vol.reset();
});

describe("generateDockerfile", () => {
  it("should generate a Dockerfile", () => {
    expect(true).toBe(true);
  });
});

it("should return correct text", () => {
  {
    const path = "/hello-world.txt";
    fs.writeFileSync(path, "hello world");

    const text = generateDockerfile(path);
    expect(text).toBe("hello world");
  }

  {
    const path = "/app/package.json";
    const text = generateDockerfile(path);
    expect(text).toContain("@foo/foo");
  }
});
