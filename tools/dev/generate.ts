import {
  buildMonorepoContext,
  generateDockerfiles,
} from "./src/generate-dockerfile.ts";

const monorepoContext = buildMonorepoContext("../../");
generateDockerfiles(monorepoContext);
