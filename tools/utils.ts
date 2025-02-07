import * as path from "path";
import type { PackageJson, Context } from "./types.ts";
import { fs } from "memfs";

// Ensure we're running from the root directory
export function findRootDir(ctx: Context) {
  let currentDir = path.dirname(ctx.startingPackage);
  while (currentDir !== "/") {
    if (ctx.fs.existsSync(path.join(currentDir, "package.json"))) {
      const pkg = JSON.parse(
        ctx.fs.readFileSync(path.join(currentDir, "package.json"))
      );
      if (pkg.workspaces?.length) {
        return currentDir;
      }
    }
    currentDir = path.dirname(currentDir);
  }
  throw new Error("Could not find root directory");
}

export function readPackageJson(filePath: string, ctx: Context): PackageJson {
  if (filePath[0] !== "/") {
    throw new Error("File path must be absolute");
  }
  try {
    return JSON.parse(ctx.fs.readFileSync(filePath));
  } catch (error) {
    console.error(`Error reading package.json at ${filePath}:`, error);
    return { name: "" };
  }
}

// export function writePackageJson(filePath: string, content: PackageJson) {
//   fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + "\n");
// }

// export function findWorkspacePackageJsons(packageJsonPath: string): string[] {
//   const rootPackageJson = readPackageJson(packageJsonPath);
//   if (!rootPackageJson.workspaces?.length) {
//     console.error("No workspaces found in root package.json");
//     return [];
//   }

//   const packageJsonPaths = new Set<string>();

//   rootPackageJson.workspaces.forEach((pattern) => {
//     // Handle both glob patterns and direct paths
//     if (pattern.includes("*")) {
//       // It's a glob pattern
//       const rootDir = path.dirname(packageJsonPath);
//       const patternPath = path.join(rootDir, pattern, "package.json");
//       const matches = glob.sync(patternPath);
//       matches.forEach((match: string) => packageJsonPaths.add(match));
//     } else {
//       // It's a direct path
//       const packageJsonPath = path.join(pattern, "package.json");
//       if (fs.existsSync(packageJsonPath)) {
//         packageJsonPaths.add(packageJsonPath);
//       }
//     }
//   });

//   return Array.from(packageJsonPaths);
// }
