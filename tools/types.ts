export interface PackageJson {
  name: string;
  workspaces?: string[];
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  files?: string[];
}

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

export interface Context {
  startingPackage: string;
  workspace: WorkspaceContext | undefined;
  fs: {
    readFileSync: (path: string) => string;
    existsSync: (path: string) => boolean;
    writeFileSync: (path: string, content: string) => void;
  };
  glob: (pattern: string) => string[];
}
