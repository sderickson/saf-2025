import { buildMonorepoContext } from "./src/generate-dockerfile.ts";

const monorepoContext = buildMonorepoContext("../../");
console.log(monorepoContext);
