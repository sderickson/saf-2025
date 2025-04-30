// Entry point for @tools/workflows
import type { ConcreteWorkflow, WorkflowMeta } from "@saflib/workflows";
import { AddTestsWorkflow, SplitFileWorkflow } from "@saflib/workflows";
import { concreteWorkflowToMeta } from "@saflib/workflows";

const workflowClasses: ConcreteWorkflow[] = [
  AddTestsWorkflow,
  SplitFileWorkflow,
];

export const workflows: WorkflowMeta[] = workflowClasses.map(
  concreteWorkflowToMeta,
);
