#!/usr/bin/env ts-node

import * as path from "path";
import {
  PackageJson,
  readPackageJson,
  writePackageJson,
  findWorkspacePackageJsons,
  initWorkspace,
} from "./utils";

// Initialize workspace
initWorkspace();

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

export function isTestingPackage(packageName: string): boolean {
  return testingPackages.some(
    (testPkg) =>
      packageName.toLowerCase().includes(testPkg.toLowerCase()) ||
      packageName.toLowerCase().endsWith("-test") ||
      packageName.toLowerCase().startsWith("test-")
  );
}

export type CleanResults = {
  packageJsonPath: string;
  originalPkg: PackageJson;
  pkg: PackageJson;
  removedDevDeps: string[];
  changed: boolean;
};

export function cleanPackageJson(
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

export function cleanAllPackageJsons(
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

if (require.main === module) {
  main();
}
