import { readFileSync } from "node:fs";

export function generateDockerfile(path: string) {
  return readFileSync(path, "utf-8");
}
