import { existsSync } from "fs";
// import type { SimpleWorkflow } from "../types.ts";
import { basename } from "path";

import { SimpleWorkflow } from "../workflow.ts";
import { getAbsPathFromProjectPath } from "../bin/common.ts";

export interface AddTestsWorkflowParams {
  path: string;
}

interface AddTestsWorkflowContext {}

export class AddTestsWorkflow extends SimpleWorkflow<
  AddTestsWorkflowParams,
  AddTestsWorkflowContext
> {
  name = "add-unit-tests";
  init = async () => {
    this.targetAbsPath();
    return { context: {} };
  };

  targetAbsPath = () => {
    const absPath = getAbsPathFromProjectPath(this.params.path);
    if (!existsSync(absPath)) {
      throw new Error(`File does not exist: ${absPath}`);
    }
    return absPath;
  };

  workflowPrompt = () => `You are adding tests to ${this.params.path}.`;

  getFilenameToTest() {
    return basename(this.params.path);
  }

  steps = [
    {
      name: "Get Oriented",
      prompt: () =>
        `First, run the existing tests for the package that ${this.getFilenameToTest()} is in. You should be able to run "npm run test". Run the tests for that package and make sure they are passing.`,
    },
    {
      name: "Add Tests",
      prompt: () =>
        `Now, add tests to ${this.getFilenameToTest()}. Create the test file next to the file you are testing.`,
    },
    {
      name: "Run Tests",
      prompt: () =>
        `Now, run the tests to make sure they are working. Fix any issues.`,
    },
  ];
}
