import StateMachine from "javascript-state-machine";

export interface Workflow {
  name: string;
  options: Record<string, any>;
  factory: ReturnType<typeof StateMachine.factory>;
}
