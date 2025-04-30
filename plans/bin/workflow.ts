export type Result<C extends Record<string, any>> = {
  data?: C;
  error?: Error;
};

export interface Step {
  name: string;
  prompt: () => string;
}

export interface CLIArgument {
  name: string;
  description?: string;
  defaultValue?: string;
}

type AbstractClassConstructor<T extends SimpleWorkflow<any, any>> = new (
  ...args: any[]
) => T;

export type WorkflowImplementation = AbstractClassConstructor<
  SimpleWorkflow<any, any>
>;

export type WorkflowStatus = "not started" | "in progress" | "completed";

export interface WorkflowBlobInternalState {
  status: WorkflowStatus;
  stepIndex: number;
  data: Record<string, any>;
  params: Record<string, any>;
}

export interface WorkflowBlob {
  workflowName: string;
  internalState: WorkflowBlobInternalState;
}

/**
 * Given a string which may have newlines already included, add /n to each line such that no line is longer than maxLineWidth.
 */
function addNewLinesToString(str: string, maxLineWidth: number = 80) {
  return str
    .split("\n")
    .map((line) => addNewLinesToLine(line, maxLineWidth))
    .join("\n");
}

function addNewLinesToLine(str: string, maxLineWidth: number = 80) {
  const words = str.split(" ");
  const lines = [];
  let currentLine = words.shift() ?? "";
  while (words.length > 0) {
    const word = words.shift() ?? "";
    if ((currentLine + " " + word).length > maxLineWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine + " " + word;
    }
  }
  lines.push(currentLine);
  return lines.join("\n");
}

export abstract class SimpleWorkflow<
  P extends Record<string, any>,
  D extends Record<string, any>,
> {
  params?: P;
  data?: D;

  abstract readonly workflowName: string;
  abstract readonly cliArguments: CLIArgument[];
  abstract init: (...args: any[]) => Promise<Result<D>>;
  abstract steps: Step[];
  abstract workflowPrompt: () => string;
  private stepIndex = 0;
  private status: WorkflowStatus = "not started";

  getData(): D {
    if (!this.data) {
      throw new Error(`Data is not set for workflow ${this.constructor.name}`);
    }
    return this.data;
  }

  getParams(): P {
    if (!this.params) {
      throw new Error(
        `Params are not set for workflow ${this.constructor.name}`,
      );
    }
    return this.params;
  }

  setData(data: D) {
    this.data = data;
  }

  print(message: string) {
    console.log("");
    console.log(addNewLinesToString(message));
  }

  async kickoff(): Promise<boolean> {
    if (this.status === "completed") {
      return true;
    }
    this.status = "in progress";
    this.print(`The "${this.workflowName}" workflow has been kicked off.`);
    await this.printStatus();
    this.print(
      `To continue, run "npm exec --workspace=@saf-2025/plans plans-next".`,
    );
    return true;
  }

  async printStatus() {
    if (this.status === "completed") {
      this.print("The workflow has been completed.");
      return;
    }
    if (this.status === "not started") {
      this.print("The workflow has not started yet.");
      return;
    }
    this.print(this.workflowPrompt());
    this.print(this.steps[this.stepIndex].prompt());
  }

  async goToNextStep() {
    if (this.status === "completed") {
      this.print("The workflow has already been completed.");
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
    await this.printStatus();
  }

  dehydrate(): WorkflowBlob {
    return {
      workflowName: this.workflowName,
      internalState: {
        status: this.status,
        stepIndex: this.stepIndex,
        data: this.data ?? {},
        params: this.params ?? {},
      },
    };
  }

  hydrate(blob: WorkflowBlob): void {
    if (typeof blob !== "object" || blob === null) {
      throw new Error("Invalid serialized data: not an object");
    }
    if (
      !["not started", "in progress", "completed"].includes(
        blob.internalState.status,
      )
    ) {
      throw new Error(`Invalid status: ${blob.internalState.status}`);
    }
    if (typeof blob.internalState.stepIndex !== "number") {
      throw new Error("Invalid stepIndex: not a number");
    }
    this.params = blob.internalState.params as any;
    this.data = blob.internalState.data as any;
    this.stepIndex = blob.internalState.stepIndex;
    this.status = blob.internalState.status;
  }
}
