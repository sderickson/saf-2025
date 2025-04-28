import { existsSync } from "fs";
import type { SimpleWorkflow } from "../types.ts";
import { resolve } from "path";

export interface AddTestsWorkflowParams {
  path: string;
}

interface AddTestsWorkflowContext {
  absPath: string;
}

export const AddTestsWorkflow: SimpleWorkflow<
  AddTestsWorkflowParams,
  AddTestsWorkflowContext
> = {
  name: "add-unit-tests",
  usage: "Takes one param: path to the file to add tests to.",
  params: {
    path: "",
  },
  init: async (params) => {
    const absPath = resolve(params.path);
    const context: AddTestsWorkflowContext = {
      absPath,
    };
    if (!existsSync(absPath)) {
      console.error(`File does not exist: ${absPath}`);
      return {
        context,
        success: false,
      };
    }
    return {
      context,
      success: true,
    };
  },
  workflowPrompt: (context) => `You are adding tests to ${context.absPath}.`,
  steps: [
    {
      name: "Get Oriented",
      prompt: (context) =>
        `First, run the existing tests for the package that ${context.absPath} is in. You should be able to run "npm run test".`,
    },
    {
      name: "Add Tests",
      prompt: (context) =>
        `Now, add tests to ${context.absPath}. Create the test file next to the file you are testing.`,
    },
    {
      name: "Run Tests",
      prompt: () =>
        `Now, run the tests to make sure they are working. Fix any issues.`,
    },
  ],
};
