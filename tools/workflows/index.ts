// Entry point for @tools/workflows
import type { ConcreteWorkflow, WorkflowMeta } from "@saflib/workflows";
import { concreteWorkflowToMeta } from "@saflib/workflows";
import { AddTestsWorkflow } from "./src/add-tests.ts";
import { SplitFileWorkflow } from "./src/split-file.ts";

const workflowClasses: ConcreteWorkflow[] = [
  AddTestsWorkflow,
  SplitFileWorkflow,
];

export const workflows: WorkflowMeta[] = workflowClasses.map(
  concreteWorkflowToMeta,
);
