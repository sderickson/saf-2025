import { existsSync } from "fs";
// import type { SimpleWorkflow } from "../types.ts";
import { resolve, basename } from "path";

import { SimpleWorkflow } from "../workflow.ts";

export interface AddTestsWorkflowParams {
  path: string;
}

interface AddTestsWorkflowContext {
  absPath: string;
}

export class AddTestsWorkflow extends SimpleWorkflow<
  AddTestsWorkflowParams,
  AddTestsWorkflowContext
> {
  name = "add-unit-tests";
  init = async () => {
    const absPath = resolve(this.params.path);
    const context: AddTestsWorkflowContext = { absPath };
    if (!existsSync(absPath)) {
      return {
        context,
        error: new Error(`File does not exist: ${absPath}`),
      };
    }
    return { context };
  };

  workflowPrompt = () =>
    `You are adding tests to ${this.getContext()?.absPath}.`;

  getFilenameToTest() {
    return basename(this.getContext().absPath);
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
