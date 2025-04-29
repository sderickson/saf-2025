import type { Result, Step } from "./types.ts";

export abstract class SimpleWorkflow<
  P extends Record<string, any>,
  C extends Record<string, any>,
> {
  readonly params: P;
  context?: C;

  abstract name: string;
  abstract init: () => Promise<Result<C>>;
  abstract steps: Step[];
  abstract workflowPrompt: () => string;
  private stepIndex = 0;
  private status: "not started" | "in progress" | "completed" = "not started";

  constructor(params: P) {
    this.params = params;
  }

  getContext(): C {
    if (!this.context) {
      throw new Error(`Context is not set for workflow ${this.name}`);
    }
    return this.context;
  }

  setContext(context: C) {
    this.context = context;
  }

  getStatus(): string {
    return this.status;
  }

  print(message: string) {
    console.log("");
    console.log(message);
  }

  async kickoff(): Promise<boolean> {
    const result = await this.init();
    if (result.error) {
      this.print(result.error.message);
      return false;
    }
    this.status = "in progress";
    this.print(`The "${this.name}" workflow has been kicked off.`);
    this.print(await this.getStatusPrompt());
    this.print(
      `To continue, run "npm exec --workspace=@saf-2025/plans plans-next".`,
    );
    return true;
  }

  async getStatusPrompt(): Promise<string> {
    if (this.status === "completed") {
      return "The workflow has been completed.";
    }
    if (this.status === "not started") {
      return "The workflow has not started yet.";
    }
    let workflowPrompt = this.workflowPrompt();
    let stepPrompt = this.steps[this.stepIndex].prompt();
    return `${workflowPrompt}\n\n${stepPrompt}`;
  }

  async goToNextStep() {
    if (this.status === "completed") {
      return;
    }
    this.stepIndex++;
    if (this.stepIndex >= this.steps.length) {
      this.status = "completed";
      this.print(`The workflow has been completed.`);
      return;
    }
    this.print(
      `The workflow has moved to step "${this.steps[this.stepIndex].name}".`,
    );
    this.print(await this.getStatusPrompt());
  }

  serialize(): string {
    const serializable = {
      status: this.status,
      stepIndex: this.stepIndex,
      context: this.context,
    };
    return JSON.stringify(serializable, null, 2);
  }

  deserialize(serialized: string): void {
    const serializable = JSON.parse(serialized);
    if (typeof serializable !== "object" || serializable === null) {
      throw new Error("Invalid serialized data: not an object");
    }
    if (
      !["not started", "in progress", "completed"].includes(serializable.status)
    ) {
      throw new Error(`Invalid status: ${serializable.status}`);
    }
    if (typeof serializable.stepIndex !== "number") {
      throw new Error("Invalid stepIndex: not a number");
    }
    this.stepIndex = serializable.stepIndex;
    this.context = serializable.context;
  }
}
