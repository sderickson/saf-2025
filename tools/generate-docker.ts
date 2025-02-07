#!/usr/bin/env ts-node

// Note - this script is entirely generated. But it works? It needs tests.

import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";
import type { PackageJson } from "./types.ts";
import {
  readPackageJson,
  readProject,
  getInternalDependencies,
  getRelativePath,
} from "./utils.ts";
import { Context } from "./types.ts";

export function generateDockerfile(
  packageJsonPath: string,
  ctx: Context
): string {
  const packageJson = ctx.project.workspacePackages.get(packageJsonPath)!;
  const dependencies = getInternalDependencies(packageJsonPath, ctx.project);
  const workspacePath = getRelativePath(packageJsonPath, ctx.project);
  const workspaceDir = path.dirname(workspacePath);

  const lines = [
    "FROM node:22-slim",
    "",
    "WORKDIR /app",
    "",
    "# Copy package.json",
    "COPY package*.json ./",
    "COPY tsconfig.json ./",
    `COPY ${workspaceDir}/package*.json ./${workspaceDir}/`,
  ];

  dependencies.forEach((dep, depPath) => {
    // const depWorkspace = dep.workspacePackages.get(dep);
    // if (!depWorkspace) return;
    const depWorkspacePath = getRelativePath(depPath, ctx.project);
    const depWorkspaceDir = path.dirname(depWorkspacePath);

    lines.push(`COPY ${depWorkspaceDir}/package*.json ./${depWorkspaceDir}/`);
  });

  lines.push("", "RUN npm install --omit=dev");

  lines.push("", "# Copy source files");

  // Copy dependencies
  dependencies.forEach((dep, depPath) => {
    if (!dep) return;
    const depWorkspacePath = getRelativePath(depPath, ctx.project);
    const depWorkspaceDir = path.dirname(depWorkspacePath);

    if (dep.files) {
      dep.files.forEach((file) => {
        lines.push(
          `COPY ${depWorkspaceDir}/${file} ./${depWorkspaceDir}/${file}`
        );
      });
    } else {
      lines.push(`COPY ${depWorkspaceDir} ./${depWorkspaceDir}`);
    }
    lines.push("");
  });

  // Copy service files
  if (packageJson.files) {
    packageJson.files.forEach((file) => {
      lines.push(`COPY ${workspaceDir}/${file} ./${workspaceDir}/${file}`);
    });
  } else {
    lines.push(`COPY ${workspaceDir} ./${workspaceDir}`);
  }

  lines.push(
    "",
    'HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD ["npm", "run", "healthcheck"]',
    `WORKDIR /app/${workspaceDir}`,
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
//     console.log("depWorkspace", depWorkspace);
//     console.log("context.rootPackageJson", context.rootPackageJson);

//     if (depWorkspace.files) {
//       depWorkspace.files.forEach((file) => {
//         // TODO - don't rely on that every package is two levels deep
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
