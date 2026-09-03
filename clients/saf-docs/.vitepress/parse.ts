import { readdirSync, statSync, readFileSync, existsSync } from "fs";
import { join, relative, sep } from "path";
import { buildMonorepoContext } from "@saflib/monorepo/workspace";

export interface document {
  text: string;
  link: string;
}

export interface packageInfo {
  name: string;
  docs: document[];
}

export interface suiteInfo {
  name: string;
  docs: document[];
}

const suiteDocLinks = (docsDir: string, rootPath: string): document[] => {
  const docs: document[] = [];
  const files = readdirSync(docsDir).filter((file) => file.endsWith(".md"));

  for (const file of files) {
    const absPath = join(docsDir, file);
    const firstLine = readFileSync(absPath, "utf8").split("\n")[0];
    docs.push({
      text: firstLine.replace(/^#\s*/, "").trim(),
      link: absPath.replace(rootPath, ""),
    });
  }

  return docs;
};

const packageDocLinks = (
  packageDir: string,
  rootPath: string,
): document[] => {
  const docsDir = join(packageDir, "docs");
  const docs = suiteDocLinks(docsDir, rootPath);

  const refPath = join(docsDir, "ref", "index.md");
  if (existsSync(refPath)) {
    docs.push({
      text: "Code Reference",
      link: refPath.replace(rootPath, ""),
    });
  }

  const cliPath = join(docsDir, "cli", "index.md");
  if (existsSync(cliPath)) {
    docs.push({
      text: "CLI Tools",
      link: cliPath.replace(rootPath, ""),
    });
  }

  const envPath = join(docsDir, "env", "index.md");
  if (existsSync(envPath)) {
    docs.push({
      text: "Environment Variables",
      link: envPath.replace(rootPath, ""),
    });
  }

  const workflowsPath = join(docsDir, "workflows", "index.md");
  if (existsSync(workflowsPath)) {
    docs.push({
      text: "Workflows",
      link: workflowsPath.replace(rootPath, ""),
    });
  }

  return docs;
};

const discoverSuites = (rootPath: string): suiteInfo[] => {
  const suites: suiteInfo[] = [];
  const saflibRoot = rootPath;

  for (const entry of readdirSync(saflibRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "node_modules") {
      continue;
    }

    const suiteDir = join(saflibRoot, entry.name);
    const docsDir = join(suiteDir, "docs");
    const packageJsonPath = join(suiteDir, "package.json");

    if (!existsSync(docsDir) || existsSync(packageJsonPath)) {
      continue;
    }

    const docs = suiteDocLinks(docsDir, rootPath);
    if (!docs.length) {
      continue;
    }

    suites.push({
      name: `@saflib/${entry.name}-*`,
      docs,
    });
  }

  return suites;
};

const getSuiteMemberPackageNames = (
  rootPath: string,
  monorepoContext: ReturnType<typeof buildMonorepoContext>,
): Set<string> => {
  const members = new Set<string>();

  for (const suite of discoverSuites(rootPath)) {
    const suiteSlug = suite.name.replace("@saflib/", "").replace(/-\*$/, "");
    const suiteDir = join(rootPath, suiteSlug);

    for (const packageName of monorepoContext.packages) {
      const packageDir =
        monorepoContext.monorepoPackageDirectories[packageName];
      const rel = relative(suiteDir, packageDir);
      const segments = rel.split(sep).filter(Boolean);
      // Only hide direct children (e.g. backup/backup-http), not nested packages
      // under subfolders (e.g. base/service/audit).
      if (!rel.startsWith("..") && segments.length === 1) {
        members.add(packageName);
      }
    }
  }

  return members;
};

const getDocsByPackage = (rootPath: string) => {
  const monorepoContext = buildMonorepoContext(rootPath);
  const suiteMembers = getSuiteMemberPackageNames(rootPath, monorepoContext);

  const packages = Array.from(monorepoContext.packages)
    .filter((packageName) => packageName.startsWith("@saflib/"))
    .filter((packageName) => !suiteMembers.has(packageName))
    .map((packageName) => {
      const packageDir =
        monorepoContext.monorepoPackageDirectories[packageName];
      const docsDir = join(packageDir, "docs");
      if (!existsSync(docsDir)) {
        return false;
      }
      const stat = statSync(docsDir);
      if (!stat.isDirectory()) {
        return false;
      }

      const docs = packageDocLinks(packageDir, rootPath);
      if (!docs.length) {
        return false;
      }

      return {
        name: packageName,
        docs,
      } satisfies packageInfo;
    })
    .filter((p) => p !== false);

  const suites = discoverSuites(rootPath);

  return { packages, suites };
};

export { getDocsByPackage };
