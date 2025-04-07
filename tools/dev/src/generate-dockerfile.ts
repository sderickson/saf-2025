import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

export function generateDockerfile(path: string) {
  return readFileSync(path, "utf-8");
}

interface PackageJson {
  name: string;
  workspaces?: string[];
  dependencies?: Record<string, string>;
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

  const workspaces = rootPackageJson.workspaces ?? [];
  const workspacePackageJsonPaths: string[] = [];

  for (const workspace of workspaces) {
    if (workspace.endsWith("/*")) {
      const workspacesDir = path.join(rootDir, workspace.slice(0, -1));
      const workspacesFolders = readdirSync(workspacesDir)
        .filter((folder) => !folder.startsWith("."))
        .filter((folder) =>
          statSync(path.join(workspacesDir, folder)).isDirectory(),
        );
      for (const workspaceFolder of workspacesFolders) {
        workspacePackageJsonPaths.push(
          path.join(workspacesDir, workspaceFolder, "package.json"),
        );
      }
    } else {
      workspacePackageJsonPaths.push(
        path.join(rootDir, workspace, "package.json"),
      );
    }
  }

  for (const workspacePackageJsonPath of workspacePackageJsonPaths) {
    const workspacePackageJson = JSON.parse(
      readFileSync(workspacePackageJsonPath, "utf-8"),
    ) as PackageJson;
    monorepoPackageJsons[workspacePackageJson.name] = workspacePackageJson;
  }

  return monorepoPackageJsons;
}

interface WorkspaceDependencyGraph {
  [key: string]: string[];
}

export function buildWorkspaceDependencyGraph(
  monorepoPackageJsons: MonorepoPackageJsons,
): WorkspaceDependencyGraph {
  const dependencyGraph: WorkspaceDependencyGraph = {};

  for (const packageJson of Object.values(monorepoPackageJsons)) {
    dependencyGraph[packageJson.name] = Object.keys(
      packageJson.dependencies ?? {},
    ).filter((dependency) => monorepoPackageJsons[dependency] !== undefined);
  }

  return dependencyGraph;
}
