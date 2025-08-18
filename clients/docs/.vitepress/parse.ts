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

function findMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (item.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

interface accumulatedDocs {
  [key: string]: packageInfo;
}

const getDocsByPackage2 = (rootPath: string) => {
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
      return info;
    })
    .filter((p) => p !== false);
  console.log("packages", packages);
  return packages;
};

const getDocsByPackage = (rootPath: string) => {
  return getDocsByPackage2(rootPath);

  const markdownFiles = findMarkdownFiles(rootPath);

  const docsByPackage: accumulatedDocs = markdownFiles.reduce(
    (acc: accumulatedDocs, file: string) => {
      // console.log("file", file);
      const relativePath = file.replace(rootPath, "");
      const numberOfDirectories = relativePath.split("/").length;
      if (numberOfDirectories < 3) {
        // e.g. "/README.md"
        return acc;
      }

      const packageName = relativePath.split("/").slice(1, 2).join("/");
      if (!acc[packageName]) {
        const packageJsonPath = join(rootPath, packageName, "package.json");
        if (!existsSync(packageJsonPath)) {
          return acc;
        }
        acc[packageName] = {
          name: packageName,
          docs: [],
        };
      }

      if (relativePath.split("/").includes("docs")) {
        const firstLine = readFileSync(file, "utf8").split("\n")[0];
        const text = firstLine.replace("#", "").trim();
        const link = relativePath;
        acc[packageName].docs.push({
          text,
          link,
        });
      }
      return acc;
    },
    {},
  );
  // console.log(docsByPackage);
  return docsByPackage;
};

export { getDocsByPackage };
