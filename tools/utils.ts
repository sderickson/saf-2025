import * as fs from "fs";
import * as path from "path";

export interface PackageJson {
  name: string;
  workspaces?: string[];
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  files?: string[];
}

// Ensure we're running from the root directory
export function findRootDir() {
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

export function readPackageJson(filePath: string): PackageJson {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`Error reading package.json at ${filePath}:`, error);
    return { name: "" };
  }
}

export function writePackageJson(filePath: string, content: PackageJson) {
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + "\n");
}

export function findWorkspacePackageJsons(): string[] {
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

// Initialize workspace by finding and changing to root directory
export function initWorkspace() {
  process.chdir(findRootDir());
}
