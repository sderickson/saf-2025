#!/usr/bin/env ts-node

// Note - this script is entirely generated. But it works? It needs tests.

import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";
import type { PackageJson, WorkspaceContext, WorkspaceInfo } from "./types.ts";
import { readPackageJson, findWorkspacePackageJsons } from "./utils.ts";
import { Context } from "./types.ts";

export function addWorkspaceContext(
  startingPackage: string,
  ctx: Context
): Context {
  const rootPackageJson = readPackageJson(startingPackage, ctx);
  if (!rootPackageJson.workspaces?.length) {
    console.error("No workspaces found in root package.json");
    return {
      ...ctx,
      workspace: {
        rootPackageJson,
        workspacePackages: new Map(),
      },
    };
  }

  const workspacePackages = new Map<string, WorkspaceInfo>();
  const packageJsonCache = new Map<string, PackageJson>();

  // Single pass: collect all workspaces and their package.json contents
  findWorkspacePackageJsons(startingPackage, ctx).forEach((packageJsonPath) => {
    const packageJson = readPackageJson(packageJsonPath, ctx);
    packageJsonCache.set(packageJson.name, packageJson);

    // Create workspace entry (dependencies to be resolved)
    workspacePackages.set(packageJson.name, {
      name: packageJson.name,
      path: path.dirname(packageJsonPath),
      dependencies: [],
      files: packageJson.files,
    });
  });

  // Resolve dependencies using cached package.json contents
  for (const [name, workspace] of workspacePackages) {
    const packageJson = packageJsonCache.get(name);
    if (!packageJson) continue;

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    workspace.dependencies = Object.keys(allDeps).filter((dep) =>
      workspacePackages.has(dep)
    );
  }

  return {
    ...ctx,
    workspace: {
      rootPackageJson,
      workspacePackages,
    },
  };
}

export function generateDockerfile(
  workspace: WorkspaceInfo,
  workspaceContext: WorkspaceContext
): string {
  const lines = [
    "FROM node:22-slim",
    "",
    "WORKDIR /app",
    "",
    "# Copy package.json",
    "COPY package*.json ./",
    "COPY tsconfig.json ./",
    `COPY ${workspace.path}/package*.json ./${workspace.path}/`,
  ];

  workspace.dependencies.forEach((dep) => {
    const depWorkspace = workspaceContext.workspacePackages.get(dep);
    if (!depWorkspace) return;

    lines.push(
      `COPY ${depWorkspace.path}/package*.json ./${depWorkspace.path}/`
    );
  });

  lines.push("", "RUN npm install --omit=dev");

  lines.push("", "# Copy source files");

  // Copy dependencies
  workspace.dependencies.forEach((dep) => {
    const depWorkspace = workspaceContext.workspacePackages.get(dep);
    if (!depWorkspace) return;

    if (depWorkspace.files) {
      depWorkspace.files.forEach((file) => {
        lines.push(
          `COPY ${depWorkspace.path}/${file} ./${depWorkspace.path}/${file}`
        );
      });
    } else {
      lines.push(`COPY ${depWorkspace.path} ./${depWorkspace.path}`);
    }
    lines.push("");
  });

  // Copy service files
  if (workspace.files) {
    workspace.files.forEach((file) => {
      lines.push(`COPY ${workspace.path}/${file} ./${workspace.path}/${file}`);
    });
  } else {
    lines.push(`COPY ${workspace.path} ./${workspace.path}`);
  }

  lines.push(
    "",
    'HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD ["npm", "run", "healthcheck"]',
    `WORKDIR /app/${workspace.path}`,
    'CMD ["npm", "start"]'
  );

  return lines.join("\n");
}

// export function generateWatchPaths(
//   workspace: WorkspaceInfo,
//   context: WorkspaceContext
// ): WatchConfig[] {
//   const watchPaths: WatchConfig[] = [];

//   // Helper function to add watch path
//   const addWatch = (sourcePath: string, targetPath: string) => {
//     watchPaths.push({
//       action: "sync+restart",
//       path: sourcePath,
//       target: targetPath,
//     });
//   };

//   // Add dependency watch paths
//   workspace.dependencies.forEach((dep) => {
//     const depWorkspace = context.workspacePackages.get(dep);
//     if (!depWorkspace) return;

//     if (depWorkspace.files) {
//       depWorkspace.files.forEach((file) => {
//         addWatch(
//           `../../${depWorkspace.path}/${file}`,
//           `/app/${depWorkspace.path}/${file}`
//         );
//       });
//     } else {
//       addWatch(`../../${depWorkspace.path}`, `/app/${depWorkspace.path}`);
//     }
//   });

//   // Add service watch path
//   addWatch(".", `/app/${workspace.path}`);

//   return watchPaths;
// }

// export function generateDockerCompose(
//   workspace: WorkspaceInfo,
//   context: WorkspaceContext
// ): string {
//   const templatePath = path.join(
//     workspace.path,
//     "docker-compose.yaml.template"
//   );
//   let compose: DockerCompose;
//   const serviceName = workspace.name.replace("@saf/", "");

//   try {
//     if (fs.existsSync(templatePath)) {
//       compose = yaml.parse(fs.readFileSync(templatePath, "utf8"));
//     } else {
//       compose = {
//         services: {
//           [serviceName]: {
//             build: {
//               context: ".",
//               dockerfile: path.join(workspace.path, "Dockerfile"),
//             },
//           },
//         },
//       };
//     }

//     // Ensure service and watch configuration exists
//     const service = (compose.services[serviceName] = compose.services[
//       serviceName
//     ] || {
//       build: {
//         context: ".",
//         dockerfile: path.join(workspace.path, "Dockerfile"),
//       },
//     });

//     service.develop = service.develop || {};
//     service.develop.watch = [
//       ...(service.develop.watch || []),
//       ...generateWatchPaths(workspace, context),
//     ];

//     // Remove duplicates
//     service.develop.watch = service.develop.watch.filter(
//       (watch, index, self) =>
//         index ===
//         self.findIndex(
//           (w) => w.path === watch.path && w.target === watch.target
//         )
//     );

//     return yaml.stringify(compose);
//   } catch (error) {
//     console.error(`Error processing template for ${workspace.name}:`, error);
//     throw error;
//   }
// }

// export function main() {
//   // Initialize workspace

//   const thisPackagePath = path.join(process.cwd(), "package.json");
//   const context = createWorkspaceContext(thisPackagePath);
//   const serviceWorkspaces = Array.from(
//     context.workspacePackages.values()
//   ).filter((w) => w.path.startsWith("services/"));

//   serviceWorkspaces.forEach((workspace) => {
//     const dockerfilePath = path.join(workspace.path, "Dockerfile");
//     const dockerComposePath = path.join(workspace.path, "docker-compose.yaml");
//     console.log("writing to workspace", workspace.path);

//     fs.writeFileSync(dockerfilePath, generateDockerfile(workspace, context));
//     fs.writeFileSync(
//       dockerComposePath,
//       generateDockerCompose(workspace, context)
//     );

//     console.log(`Generated Docker files for ${workspace.name}`);
//   });
// }
