import { getMonorepoPackageJsons } from "./src/generate-dockerfile.ts";

const packageJsons = getMonorepoPackageJsons("../../");
console.log(packageJsons);
