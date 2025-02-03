#!/usr/bin/env ts-node

import * as fs from "fs";
import * as path from "path";

// Ensure we're running from the root directory
function findRootDir() {
  let currentDir = __dirname;
  while (currentDir !== "/") {
    if (fs.existsSync(path.join(currentDir, "package.json"))) {
      const pkg = JSON.parse(
        fs.readFileSync(path.join(currentDir, "package.json"), "utf8")
      );
      if (pkg.name === "saf-2025") {
        return currentDir;
      }
    }
    currentDir = path.dirname(currentDir);
  }
  throw new Error("Could not find root directory");
}

// Change to root directory
process.chdir(findRootDir());

interface PackageJson {
  name: string;
  workspaces?: string[];
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function readPackageJson(filePath: string): PackageJson {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`Error reading package.json at ${filePath}:`, error);
    return { name: "" };
  }
}

function writePackageJson(filePath: string, content: PackageJson) {
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + "\n");
}

function findWorkspacePackageJsons(): string[] {
  const rootPackageJson = readPackageJson("package.json");
  if (!rootPackageJson.workspaces?.length) {
    console.error("No workspaces found in root package.json");
    return [];
  }

  const packageJsonPaths: string[] = [];
  rootPackageJson.workspaces.forEach((pattern) => {
    const workspacePath = pattern.replace("/*", "");
    const packageJsonPath = path.join(workspacePath, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      packageJsonPaths.push(packageJsonPath);
    }
  });

  return packageJsonPaths;
}

// List of common testing-related packages
const testingPackages = [
  "vitest",
  "jest",
  "mocha",
  "chai",
  "sinon",
  "supertest",
  "cypress",
  "playwright",
  "@testing-library",
  "@vitest",
  "@jest",
  "ts-jest",
  "jsdom",
  "c8",
  "nyc",
  "istanbul",
  "test",
  "testing",
];

function isTestingPackage(packageName: string): boolean {
  return testingPackages.some(
    (testPkg) =>
      packageName.toLowerCase().includes(testPkg.toLowerCase()) ||
      packageName.toLowerCase().endsWith("-test") ||
      packageName.toLowerCase().startsWith("test-")
  );
}

type CleanResults = {
  packageJsonPath: string;
  originalPkg: PackageJson;
  pkg: PackageJson;
  removedDevDeps: string[];
  changed: boolean;
};

function cleanPackageJson(
  packageJsonPath: string,
  keepDevDeps: boolean = false,
  dryRun: boolean = false
): CleanResults {
  const pkg = readPackageJson(packageJsonPath);
  const originalPkg = { ...pkg };
  let changed = false;

  // Clean devDependencies if not keeping them
  if (pkg.devDependencies) {
    if (!keepDevDeps) {
      delete pkg.devDependencies;
      changed = true;
    } else {
      const newDevDeps: Record<string, string> = {};
      Object.entries(pkg.devDependencies).forEach(([name, version]) => {
        if (!isTestingPackage(name)) {
          newDevDeps[name] = version;
        } else {
          changed = true;
        }
      });
      pkg.devDependencies = newDevDeps;
    }
  }

  if (changed && !dryRun) {
    writePackageJson(packageJsonPath, pkg);
  }
  return {
    packageJsonPath,
    originalPkg,
    pkg,
    removedDevDeps: Object.keys(originalPkg.devDependencies || {}).filter(
      (dep) => !pkg.devDependencies?.[dep]
    ),
    changed,
  };
}

function cleanAllPackageJsons(
  keepDevDepsPath: string,
  dryRun: boolean = false
): CleanResults[] {
  const absoluteKeepDevDepsPath = path.resolve(keepDevDepsPath);
  const packageJsons = findWorkspacePackageJsons();

  if (dryRun) {
    console.log("DRY RUN - No changes will be written to files");
  }

  const results: CleanResults[] = [];

  packageJsons.forEach((packageJsonPath) => {
    const absolutePath = path.resolve(packageJsonPath);
    const keepDevDeps = absolutePath === absoluteKeepDevDepsPath;
    console.log({
      absolutePath,
      absoluteKeepDevDepsPath,
      keepDevDeps,
      equal: absolutePath === absoluteKeepDevDepsPath,
    });
    results.push(cleanPackageJson(packageJsonPath, keepDevDeps, dryRun));
  });

  return results;
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const keepDevDepsPath = args.find((arg) => !arg.startsWith("--"));

  if (!keepDevDepsPath) {
    console.error(
      "Usage: clean-docker-deps.ts <package-json-path-to-keep-devdeps> [--dry-run]"
    );
    process.exit(1);
  }

  const results = cleanAllPackageJsons(keepDevDepsPath, dryRun);
  console.log(
    "Results:",
    JSON.stringify(
      results.map((r) => ({
        packageJsonPath: r.packageJsonPath,
        removedDevDeps: r.removedDevDeps,
        changed: r.changed,
      })),
      null,
      2
    )
  );
}

main();
