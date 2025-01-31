#!/usr/bin/env ts-node

import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";

interface PackageJson {
  name: string;
  workspaces?: string[];
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  files?: string[];
}

interface WorkspaceInfo {
  name: string;
  path: string;
  dependencies: string[];
  files?: string[];
}

interface WatchConfig {
  action: string;
  path: string;
  target: string;
}

function readPackageJson(filePath: string): PackageJson {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`Error reading package.json at ${filePath}:`, error);
    return { name: "" };
  }
}

function findWorkspaces(): WorkspaceInfo[] {
  const rootPackageJson = readPackageJson("package.json");
  const workspaces: WorkspaceInfo[] = [];

  if (!rootPackageJson.workspaces) {
    console.error("No workspaces found in root package.json");
    return [];
  }

  for (const pattern of rootPackageJson.workspaces) {
    const workspacePath = pattern.replace("/*", "");
    if (fs.existsSync(path.join(workspacePath, "package.json"))) {
      const packageJson = readPackageJson(
        path.join(workspacePath, "package.json")
      );
      const dependencies = [
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.devDependencies || {}),
      ].filter((dep) => {
        // Filter only workspace dependencies
        return rootPackageJson.workspaces?.some(
          (ws) =>
            dep ===
            readPackageJson(path.join(ws.replace("/*", ""), "package.json"))
              .name
        );
      });

      console.log("packageJson?", packageJson);
      workspaces.push({
        name: packageJson.name,
        path: workspacePath,
        dependencies,
        files: packageJson.files,
      });
    }
  }

  return workspaces;
}

function generateDockerfile(workspace: WorkspaceInfo): string {
  let dockerfile = "FROM node:22-slim\n\n";
  dockerfile += "WORKDIR /app\n\n";

  // Copy package files and tsconfig first for better caching
  dockerfile += "COPY package*.json ./\n";
  dockerfile += "COPY tsconfig.json ./\n";
  dockerfile += `COPY ${workspace.path}/package*.json ./${workspace.path}/\n\n`;

  // Copy dependencies
  for (const dep of workspace.dependencies) {
    const depWorkspace = findWorkspaces().find((ws) => ws.name === dep);
    if (depWorkspace) {
      if (depWorkspace.files) {
        for (const file of depWorkspace.files) {
          dockerfile += `COPY ${depWorkspace.path}/${file} ./${depWorkspace.path}/${file}\n`;
        }
      } else {
        dockerfile += `COPY ${depWorkspace.path} ./${depWorkspace.path}\n`;
      }
    }
  }

  // Copy the service's own files
  if (workspace.files) {
    for (const file of workspace.files) {
      dockerfile += `COPY ${workspace.path}/${file} ./${workspace.path}/${file}\n`;
    }
  } else {
    dockerfile += `COPY ${workspace.path} ./${workspace.path}\n`;
  }

  dockerfile += "\nRUN npm install\n";
  dockerfile += `WORKDIR /app/${workspace.path}\n`;
  dockerfile += 'CMD ["npm", "start"]\n';

  return dockerfile;
}

function generateWatchPaths(workspace: WorkspaceInfo): WatchConfig[] {
  const watchPaths: WatchConfig[] = [];

  // Add watch paths for dependencies
  for (const dep of workspace.dependencies) {
    const depWorkspace = findWorkspaces().find((ws) => ws.name === dep);
    if (depWorkspace) {
      if (depWorkspace.files) {
        console.log("depWorkspace.files", depWorkspace.files);
        for (const file of depWorkspace.files) {
          //   const basePath = path.dirname(file);
          watchPaths.push({
            action: "sync+restart",
            path: `../../${depWorkspace.path}/${file}`,
            target: `/app/${depWorkspace.path}/${file}`,
          });
        }
      } else {
        console.log("depWorkspace.files", depWorkspace);
        watchPaths.push({
          action: "sync+restart",
          path: `../../${depWorkspace.path}`,
          target: `/app/${depWorkspace.path}`,
        });
      }
    }
  }

  // Add watch paths for the service's own files
  if (workspace.files) {
    for (const file of workspace.files) {
      const basePath = path.dirname(file);
      watchPaths.push({
        action: "sync+restart",
        path: `.`,
        target: `/app/${workspace.path}`,
      });
    }
  } else {
    watchPaths.push({
      action: "sync+restart",
      path: ".",
      target: `/app/${workspace.path}`,
    });
  }

  return watchPaths;
}

function generateDockerCompose(workspace: WorkspaceInfo): string {
  const templatePath = path.join(
    workspace.path,
    "docker-compose.yaml.template"
  );
  let compose: any;

  try {
    if (fs.existsSync(templatePath)) {
      const templateContent = fs.readFileSync(templatePath, "utf8");
      compose = yaml.parse(templateContent);
    } else {
      // Fallback to basic template if no template file exists
      compose = {
        services: {
          [workspace.name]: {
            build: {
              context: ".",
              dockerfile: path.join(workspace.path, "Dockerfile"),
            },
            develop: {
              watch: [],
            },
          },
        },
      };
    }

    // Ensure the service exists in the template
    if (!compose.services[workspace.name]) {
      compose.services[workspace.name] = {
        build: {
          context: ".",
          dockerfile: path.join(workspace.path, "Dockerfile"),
        },
        develop: {
          watch: [],
        },
      };
    }

    // Ensure develop.watch exists
    if (!compose.services[workspace.name].develop) {
      compose.services[workspace.name].develop = { watch: [] };
    }
    if (!compose.services[workspace.name].develop.watch) {
      compose.services[workspace.name].develop.watch = [];
    }

    // Add or merge watch paths
    const watchPaths = generateWatchPaths(workspace);
    compose.services[workspace.name].develop.watch = [
      ...compose.services[workspace.name].develop.watch,
      ...watchPaths,
    ];

    // Remove any duplicate watch paths
    compose.services[workspace.name].develop.watch = compose.services[
      workspace.name
    ].develop.watch.filter(
      (watch: WatchConfig, index: number, self: WatchConfig[]) =>
        index ===
        self.findIndex(
          (w: WatchConfig) => w.path === watch.path && w.target === watch.target
        )
    );

    return yaml.stringify(compose);
  } catch (error) {
    console.error(`Error processing template for ${workspace.name}:`, error);
    throw error;
  }
}

function main() {
  const workspaces = findWorkspaces();

  for (const workspace of workspaces) {
    // Only generate for services
    if (!workspace.path.startsWith("services/")) continue;

    const dockerfilePath = path.join(workspace.path, "Dockerfile");
    const dockerComposePath = path.join(workspace.path, "docker-compose.yaml");

    fs.writeFileSync(dockerfilePath, generateDockerfile(workspace));
    fs.writeFileSync(dockerComposePath, generateDockerCompose(workspace));

    console.log(`Generated Docker files for ${workspace.name}`);
  }
}

main();
