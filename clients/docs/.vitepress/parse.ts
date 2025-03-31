import { readdirSync, statSync, readFileSync, existsSync } from "fs";
import { join, resolve } from "path";

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

const saflibPath = resolve(__dirname, "../../../saflib");
const markdownFiles = findMarkdownFiles(saflibPath);

export interface document {
  text: string;
  link: string;
}

export interface packageInfo {
  name: string;
  docs: document[];
  index: string;
  group: string;
  json: object;
}

const docsByPackage: Record<string, packageInfo> = markdownFiles.reduce(
  (acc, file) => {
    const relativePath = file.replace(saflibPath, "");
    const numberOfDirectories = relativePath.split("/").length;
    if (numberOfDirectories < 3) {
      // e.g. "/README.md"
      return acc;
    }
    const packageName = relativePath.split("/").slice(1, 2).join("/");
    if (!acc[packageName]) {
      const packageJsonPath = join(saflibPath, packageName, "package.json");
      if (!existsSync(packageJsonPath)) {
        return acc;
      }
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

      const indexPath = join(saflibPath, packageName, "index.md");
      acc[packageName] = {
        name: packageName,
        docs: [],
        index: existsSync(indexPath) ? indexPath : "",
        group: packageJson.saflib ? packageJson.saflib.group || "" : "",
        json: packageJson,
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

export { docsByPackage };
