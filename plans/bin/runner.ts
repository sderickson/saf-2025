import type { SimpleWorkflow, BaseContext } from "../types.ts";

const print = (message: string) => {
  console.log(message);
};

export class WorkflowRunner<
  P extends Record<string, any>,
  C extends Record<string, any>,
> {
  private context: C & BaseContext<P>;
  private stepIndex = 0;
  private status: "not started" | "in progress" | "completed" = "not started";
  private workflow: SimpleWorkflow<P, C>;
  constructor(workflow: SimpleWorkflow<P, C>) {
    this.workflow = workflow;
    this.context = {} as C & BaseContext<P>;
  }

  getStatus(): string {
    return this.status;
  }

  async kickoff(params: P): Promise<boolean> {
    const result = await this.workflow.init(params);
    if (!result.success) {
      return false;
    }
    this.context = {
      ...result.context,
      print,
      params,
    };
    this.status = "in progress";
    this.context.print(
      `The workflow has been kicked off.\n\n${await this.getStatusPrompt()}`,
    );
    return true;
  }

  async goToNextStep(): Promise<boolean> {
    if (this.stepIndex >= this.workflow.steps.length) {
      this.status = "completed";
      this.context.print(`The workflow has been completed.`);
      return false;
    }
    const step = this.workflow.steps[this.stepIndex];
    if (step.guard) {
      const result = await step.guard(this.context);
      if (!result.success) {
        this.context.print(
          `The workflow failed at step ${step.name}.\n\n${await this.getStatusPrompt()}`,
        );
        return false;
      }
      this.context = result.context;
    }
    this.stepIndex++;

    if (this.stepIndex >= this.workflow.steps.length) {
      this.status = "completed";
      this.context.print(`The workflow has been completed.`);
      return false;
    }
    this.context.print(
      `The workflow has moved to step ${step.name}.\n\n${await this.getStatusPrompt()}`,
    );
    return true;
  }

  async printStatusPrompt(): Promise<void> {
    this.context.print(await this.getStatusPrompt());
  }

  async getStatusPrompt(): Promise<string> {
    if (this.status === "completed") {
      return "The workflow has been completed.";
    }
    if (this.status === "not started") {
      return "The workflow has not started yet.";
    }
    let workflowPrompt = this.workflow.workflowPrompt(this.context);
    let stepPrompt = this.workflow.steps[this.stepIndex].prompt(this.context);
    return `${workflowPrompt}\n\n${stepPrompt}`;
  }

  serialize(): string {
    const serializable = {
      status: this.status,
      stepIndex: this.stepIndex,
      context: {
        ...this.context,
        print: undefined,
      },
    };
    return JSON.stringify(serializable, null, 2);
  }

  deserialize(serialized: string): void {
    const serialable = JSON.parse(serialized);
    this.status = serialable.status;
    this.stepIndex = serialable.stepIndex;
    this.context = {
      ...serialable.context,
      print,
    };
  }
}
