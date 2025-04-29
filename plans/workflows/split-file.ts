import { existsSync } from "fs";
// import type { SimpleWorkflow } from "../types.ts";
import { basename } from "path";

import { SimpleWorkflow } from "../workflow.ts";
import { getAbsPathFromProjectPath } from "../bin/common.ts";

export interface SplitFileWorkflowParams {
  path: string;
  item: string;
}

interface SplitFileWorkflowContext {}

export class SplitFileWorkflow extends SimpleWorkflow<
  SplitFileWorkflowParams,
  SplitFileWorkflowContext
> {
  name = "split-file";
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

  workflowPrompt = () =>
    `You are breaking up ${this.params.path} into multiple files.`;

  getFilenameToSplit() {
    return basename(this.params.path);
  }

  steps = [
    {
      name: "Get Oriented",
      prompt: () =>
        `First, run the existing tests for the package that ${this.getFilenameToSplit()} is in. You should be able to run "npm run test". Run the tests for that package and make sure they are passing.`,
    },
    {
      name: "Create an Index File",
      prompt: () =>
        `Now, create an index file for ${this.getFilenameToSplit()} which will import and re-export everything being split out.`,
    },
    {
      name: "Mark Each Item to Split",
      prompt: () =>
        `Add a comment to each ${this.params.item} in ${this.getFilenameToSplit()} that says "TODO: Split this item out into <filename>"`,
    },
    {
      name: "Split out files",
      prompt: () =>
        `For each ${this.params.item} in ${this.getFilenameToSplit()}, create a new file and move the contents of the ${this.params.item} to the new file, add it to the index file, and mark the TODO comment as DONE.`,
    },
    {
      name: "Update Imports",
      prompt: () =>
        `Update the imports from ${this.getFilenameToSplit()} to import from the new files from the index file.`,
    },
    {
      name: "Run Tests",
      prompt: () => `Run the tests again.`,
    },
    {
      name: "Delete the Old File",
      prompt: () => `Delete the old file.`,
    },
    {
      name: "Run Tests",
      prompt: () => `Run the tests again.`,
    },
  ];
}
