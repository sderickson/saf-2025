import type { CLIArgument, WorkflowImplementation } from "./bin/workflow.ts";
import { AddTestsWorkflow } from "./workflows/add-tests.ts";
import { SplitFileWorkflow } from "./workflows/split-file.ts";

const workflowClasses: WorkflowImplementation[] = [
  AddTestsWorkflow,
  SplitFileWorkflow,
];

interface WorkflowMeta {
  name: string;
  cliArguments: CLIArgument[];
  Workflow: WorkflowImplementation;
}

export const workflows: WorkflowMeta[] = workflowClasses.map((Workflow) => {
  const stubWorkflow = new Workflow();
  return {
    name: stubWorkflow.workflowName,
    cliArguments: stubWorkflow.cliArguments,
    Workflow,
  };
});
