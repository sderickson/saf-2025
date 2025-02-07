import * as path from "path";
import type { PackageJson, Context, IO, Project } from "./types.ts";

// Ensure we're running from the root directory
export function findRootDir(startingPackage: string, io: IO) {
  let currentDir = path.dirname(startingPackage);
  while (currentDir !== "/") {
    if (io.fs.existsSync(path.join(currentDir, "package.json"))) {
      const pkg = JSON.parse(
        io.fs.readFileSync(path.join(currentDir, "package.json"))
      );
      if (pkg.workspaces?.length) {
        return currentDir;
      }
    }
    currentDir = path.dirname(currentDir);
  }
  throw new Error("Could not find root directory");
}

export function readPackageJson(filePath: string, io: IO): PackageJson {
  if (filePath[0] !== "/") {
    throw new Error("File path must be absolute");
  }
  try {
    return JSON.parse(io.fs.readFileSync(filePath));
  } catch (error) {
    console.error(`Error reading package.json at ${filePath}:`, error);
    return { name: "" };
  }
}

export function writePackageJson(
  filePath: string,
  content: PackageJson,
  io: IO
) {
  io.fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + "\n");
}

export function readProject(packageJsonPath: string, io: IO): Project {
  const project: Project = {
    rootDir: path.dirname(packageJsonPath),
    rootPackageJson: readPackageJson(packageJsonPath, io),
    workspacePackages: new Map(),
  };

  if (!project.rootPackageJson.workspaces?.length) {
    console.error("No workspaces found in root package.json");
    return project;
  }

  const packageJsonPaths = new Set<string>();

  project.rootPackageJson.workspaces.forEach((pattern) => {
    // Handle both glob patterns and direct paths
    if (pattern.includes("*")) {
      // It's a glob pattern
      const rootDir = path.dirname(packageJsonPath);
      const patternPath = path.join(rootDir, pattern, "package.json");
      const matches = io.glob(patternPath);
      matches.forEach((match: string) => packageJsonPaths.add(match));
    } else {
      // It's a direct path
      const packageJsonPath = path.join(
        project.rootDir,
        pattern,
        "package.json"
      );
      if (io.fs.existsSync(packageJsonPath)) {
        packageJsonPaths.add(packageJsonPath);
      }
    }
  });

  packageJsonPaths.forEach((packageJsonPath) => {
    const packageJson = readPackageJson(packageJsonPath, io);
    project.workspacePackages.set(packageJsonPath, packageJson);
  });

  return project;
}

export function getInternalDependencies(
  packageJsonPath: string,
  project: Project
): Map<string, PackageJson> {
  const packageNameToPath = new Map<string, string>();
  for (const [path, packageJson] of project.workspacePackages.entries()) {
    packageNameToPath.set(packageJson.name, path);
  }

  // collect all dependencies as package paths and their package.json
  const stack: string[] = [packageJsonPath];
  const internalDependencies = new Map<string, PackageJson>();
  while (stack.length) {
    const packageJsonPath = stack.pop()!;
    const packageJson = project.workspacePackages.get(packageJsonPath)!;
    for (const dependency of Object.keys(packageJson.dependencies ?? {})) {
      if (dependency.startsWith("@saf/")) {
        const dependencyPackageJsonPath = packageNameToPath.get(dependency)!;
        const dependencyPackageJson = project.workspacePackages.get(
          dependencyPackageJsonPath
        )!;
        internalDependencies.set(
          dependencyPackageJsonPath,
          dependencyPackageJson
        );
        stack.push(dependencyPackageJsonPath);
      }
    }
  }

  return internalDependencies;
}

export function getRelativePath(packageJsonPath: string, project: Project) {
  const rootDir = project.rootDir;
  const relativePath = path.relative(rootDir, packageJsonPath);
  return relativePath.replace(/\\/g, "/");
}
