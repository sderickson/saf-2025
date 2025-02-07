export interface PackageJson {
  name: string;
  workspaces?: string[];
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
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

export interface Project {
  rootDir: string;
  rootPackageJson: PackageJson;
  workspacePackages: Map<string, PackageJson>;
}

export interface IO {
  fs: {
    readFileSync: (path: string) => string;
    existsSync: (path: string) => boolean;
    writeFileSync: (path: string, content: string) => void;
  };
  glob: (pattern: string) => string[];
}

export interface Context {
  project: Project;
  io: IO;
}
