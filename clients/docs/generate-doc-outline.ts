import { fileURLToPath } from "url";
import { getDocsByPackage } from "./.vitepress/parse.ts";
import path, { resolve } from "path";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsByPackage = getDocsByPackage(resolve(__dirname, "../../../saflib"));
console.log(docsByPackage);

const packages = Object.keys(docsByPackage);
const lines: string[] = [];
packages.forEach((libPackage: string) => {
  const libPackageDocs = docsByPackage[libPackage].docs;
  if (libPackageDocs.length) {
    lines.push(`/saflib/${libPackage}/docs/`);
  }
  libPackageDocs.forEach((doc) => {
    const fileName = doc.link.split("/").pop();
    lines.push(`- /${fileName}: ${doc.text}`);
  });
});

const outline = lines.join("\n");
fs.writeFileSync(resolve(__dirname, "../../saflib/doc-outline.md"), outline);
