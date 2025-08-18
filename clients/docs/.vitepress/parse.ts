import { readdirSync, statSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { buildMonorepoContext } from "@saflib/dev-tools";
export interface document {
  text: string;
  link: string;
}

export interface packageInfo {
  name: string;
  docs: document[];
}

const getDocsByPackage = (rootPath: string) => {
  const monorepoContext = buildMonorepoContext(rootPath);
  const packages = Array.from(monorepoContext.packages)
    .filter((packageName) => {
      return packageName.startsWith("@saflib/");
    })
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
      const files = readdirSync(docsDir);
      const markdownFiles = files.filter((file) => file.endsWith(".md"));
      const info: packageInfo = {
        name: packageName,
        docs: markdownFiles.map((file) => {
          const absPath = join(docsDir, file);
          const firstLine = readFileSync(absPath, "utf8").split("\n")[0];
          const relativePath = absPath.replace(rootPath, "");
          const text = firstLine.replace("#", "").trim();
          return {
            text,
            link: relativePath,
          };
        }),
      };

      const refPath = join(docsDir, "ref", "index.md");
      if (existsSync(refPath)) {
        const relativePath = refPath.replace(rootPath, "");
        info.docs.push({
          text: "Code Reference",
          link: relativePath,
        });
      }

      const cliPath = join(docsDir, "cli", "index.md");
      if (existsSync(cliPath)) {
        const relativePath = cliPath.replace(rootPath, "");
        info.docs.push({
          text: "CLI Reference",
          link: relativePath,
        });
      }
      return info;
    })
    .filter((p) => p !== false);
  return packages;
};

export { getDocsByPackage };
