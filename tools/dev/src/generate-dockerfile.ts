import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export function generateDockerfile(path: string) {
  return readFileSync(path, "utf-8");
}

interface PackageJson {
  name: string;
  workspaces: string[];
  dependencies: Record<string, string>;
}

interface MonorepoPackageJsons {
  [key: string]: PackageJson;
}

export function getMonorepoPackageJsons(rootDir: string): MonorepoPackageJsons {
  const monorepoPackageJsons: MonorepoPackageJsons = {};

  const packageJsonPath = path.join(rootDir, "package.json");
  if (!existsSync(packageJsonPath)) {
    throw new Error("package.json not found");
  }
  const rootPackageJson = JSON.parse(
    readFileSync(packageJsonPath, "utf-8"),
  ) as PackageJson;
  monorepoPackageJsons[rootPackageJson.name] = rootPackageJson;

  // const workspaces = rootPackageJson.workspaces;

  // for (const workspace of workspaces) {
  //   const workspacePackageJsonPath = path.join(rootDir, workspace, "package.json");
  //   const workspacePackageJson = JSON.parse(readFileSync(workspacePackageJsonPath, "utf-8")) as PackageJson;
  // }

  return monorepoPackageJsons;
}
