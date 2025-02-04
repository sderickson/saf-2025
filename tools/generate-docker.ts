#!/usr/bin/env ts-node

// Note - this script is entirely generated. But it works? It needs tests.

import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";
import type { PackageJson } from "./utils.ts";
import {
  readPackageJson,
  findWorkspacePackageJsons,
  initWorkspace,
} from "./utils.ts";

// Initialize workspace
initWorkspace();

export interface WorkspaceInfo {
  name: string;
  path: string;
  dependencies: string[]; // internal, mono-repo dependencies
  files?: string[];
}

export interface WatchConfig {
  action: "sync+restart";
  path: string;
  target: string;
}

export interface DockerComposeService {
  build: {
    context: string;
    dockerfile: string;
  };
  develop?: {
    watch?: WatchConfig[];
  };
  [key: string]: any;
}

export interface DockerCompose {
  services: {
    [key: string]: DockerComposeService;
  };
}

export interface WorkspaceContext {
  rootPackageJson: PackageJson;
  workspacePackages: Map<string, WorkspaceInfo>;
}

export function createWorkspaceContext(): WorkspaceContext {
  const rootPackageJson = readPackageJson("package.json");
  if (!rootPackageJson.workspaces?.length) {
    console.error("No workspaces found in root package.json");
    return { rootPackageJson, workspacePackages: new Map() };
  }

  const workspacePackages = new Map<string, WorkspaceInfo>();
  const packageJsonCache = new Map<string, PackageJson>();

  // Single pass: collect all workspaces and their package.json contents
  findWorkspacePackageJsons().forEach((packageJsonPath) => {
    const packageJson = readPackageJson(packageJsonPath);
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

  return { rootPackageJson, workspacePackages };
}

export function generateDockerfile(
  workspace: WorkspaceInfo,
  context: WorkspaceContext
): string {
  const lines = [
    "FROM node:22-slim",
    "",
    "WORKDIR /app",
    "",
    "COPY package*.json ./",
    "COPY tsconfig.json ./",
    `COPY ${workspace.path}/package*.json ./${workspace.path}/`,
    "",
  ];

  // Copy dependencies
  workspace.dependencies.forEach((dep) => {
    const depWorkspace = context.workspacePackages.get(dep);
    if (!depWorkspace) return;

    if (depWorkspace.files) {
      lines.push(
        `COPY ${depWorkspace.path}/package*.json ./${depWorkspace.path}/`
      );
      depWorkspace.files.forEach((file) => {
        lines.push(
          `COPY ${depWorkspace.path}/${file} ./${depWorkspace.path}/${file}`
        );
      });
    } else {
      lines.push(`COPY ${depWorkspace.path} ./${depWorkspace.path}`);
    }
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
    "COPY tools ./tools",
    "RUN cd tools && npm install --omit=dev",
    `RUN cd tools && npm run clean-docker-deps -- ${workspace.path}/package.json`,
    "RUN npm install",
    `WORKDIR /app/${workspace.path}`,
    'CMD ["npm", "start"]'
  );

  return lines.join("\n");
}

export function generateWatchPaths(
  workspace: WorkspaceInfo,
  context: WorkspaceContext
): WatchConfig[] {
  const watchPaths: WatchConfig[] = [];

  // Helper function to add watch path
  const addWatch = (sourcePath: string, targetPath: string) => {
    watchPaths.push({
      action: "sync+restart",
      path: sourcePath,
      target: targetPath,
    });
  };

  // Add dependency watch paths
  workspace.dependencies.forEach((dep) => {
    const depWorkspace = context.workspacePackages.get(dep);
    if (!depWorkspace) return;

    if (depWorkspace.files) {
      depWorkspace.files.forEach((file) => {
        addWatch(
          `../../${depWorkspace.path}/${file}`,
          `/app/${depWorkspace.path}/${file}`
        );
      });
    } else {
      addWatch(`../../${depWorkspace.path}`, `/app/${depWorkspace.path}`);
    }
  });

  // Add service watch path
  addWatch(".", `/app/${workspace.path}`);

  return watchPaths;
}

export function generateDockerCompose(
  workspace: WorkspaceInfo,
  context: WorkspaceContext
): string {
  const templatePath = path.join(
    workspace.path,
    "docker-compose.yaml.template"
  );
  let compose: DockerCompose;

  try {
    if (fs.existsSync(templatePath)) {
      compose = yaml.parse(fs.readFileSync(templatePath, "utf8"));
    } else {
      compose = {
        services: {
          [workspace.name]: {
            build: {
              context: ".",
              dockerfile: path.join(workspace.path, "Dockerfile"),
            },
          },
        },
      };
    }

    // Ensure service and watch configuration exists
    const service = (compose.services[workspace.name] = compose.services[
      workspace.name
    ] || {
      build: {
        context: ".",
        dockerfile: path.join(workspace.path, "Dockerfile"),
      },
    });

    service.develop = service.develop || {};
    service.develop.watch = [
      ...(service.develop.watch || []),
      ...generateWatchPaths(workspace, context),
    ];

    // Remove duplicates
    service.develop.watch = service.develop.watch.filter(
      (watch, index, self) =>
        index ===
        self.findIndex(
          (w) => w.path === watch.path && w.target === watch.target
        )
    );

    return yaml.stringify(compose);
  } catch (error) {
    console.error(`Error processing template for ${workspace.name}:`, error);
    throw error;
  }
}

export function main() {
  const context = createWorkspaceContext();
  const serviceWorkspaces = Array.from(
    context.workspacePackages.values()
  ).filter((w) => w.path.startsWith("services/"));

  serviceWorkspaces.forEach((workspace) => {
    const dockerfilePath = path.join(workspace.path, "Dockerfile");
    const dockerComposePath = path.join(workspace.path, "docker-compose.yaml");
    console.log("writing to workspace", workspace.path);

    fs.writeFileSync(dockerfilePath, generateDockerfile(workspace, context));
    fs.writeFileSync(
      dockerComposePath,
      generateDockerCompose(workspace, context)
    );

    console.log(`Generated Docker files for ${workspace.name}`);
  });
}
