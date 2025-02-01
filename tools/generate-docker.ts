#!/usr/bin/env ts-node

// Note - this script is entirely generated. But it works? It needs tests.

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
  action: "sync+restart";
  path: string;
  target: string;
}

interface DockerComposeService {
  build: {
    context: string;
    dockerfile: string;
  };
  develop?: {
    watch?: WatchConfig[];
  };
  [key: string]: any;
}

interface DockerCompose {
  services: {
    [key: string]: DockerComposeService;
  };
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
  if (!rootPackageJson.workspaces?.length) {
    console.error("No workspaces found in root package.json");
    return [];
  }

  return rootPackageJson.workspaces
    .map((pattern) => {
      const workspacePath = pattern.replace("/*", "");
      const packageJsonPath = path.join(workspacePath, "package.json");

      if (!fs.existsSync(packageJsonPath)) return null;

      const packageJson = readPackageJson(packageJsonPath);
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      const dependencies = Object.keys(allDeps).filter((dep) =>
        rootPackageJson.workspaces?.some(
          (ws) =>
            dep ===
            readPackageJson(path.join(ws.replace("/*", ""), "package.json"))
              .name
        )
      );

      const workspace: WorkspaceInfo = {
        name: packageJson.name,
        path: workspacePath,
        dependencies,
        files: packageJson.files,
      };

      return workspace;
    })
    .filter(
      (workspace): workspace is NonNullable<typeof workspace> =>
        workspace !== null
    );
}

function generateDockerfile(workspace: WorkspaceInfo): string {
  const lines = [
    "FROM node:22-slim",
    "",
    "# Install build dependencies",
    "RUN apt-get update && apt-get install -y \\",
    "    python3 \\",
    "    make \\",
    "    g++ \\",
    "    && rm -rf /var/lib/apt/lists/*",
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
    const depWorkspace = findWorkspaces().find((ws) => ws.name === dep);
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
    "RUN npm install",
    `WORKDIR /app/${workspace.path}`,
    'CMD ["npm", "start"]'
  );

  return lines.join("\n");
}

function generateWatchPaths(workspace: WorkspaceInfo): WatchConfig[] {
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
    const depWorkspace = findWorkspaces().find((ws) => ws.name === dep);
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

function generateDockerCompose(workspace: WorkspaceInfo): string {
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
      ...generateWatchPaths(workspace),
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

function main() {
  const workspaces = findWorkspaces();
  const serviceWorkspaces = workspaces.filter((w) =>
    w.path.startsWith("services/")
  );

  serviceWorkspaces.forEach((workspace) => {
    const dockerfilePath = path.join(workspace.path, "Dockerfile");
    const dockerComposePath = path.join(workspace.path, "docker-compose.yaml");

    fs.writeFileSync(dockerfilePath, generateDockerfile(workspace));
    fs.writeFileSync(dockerComposePath, generateDockerCompose(workspace));

    console.log(`Generated Docker files for ${workspace.name}`);
  });
}

main();
