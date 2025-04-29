export interface BaseContext<P extends Record<string, any>> {
  print: (message: string) => void;
  params: P;
}

export type Result<C extends Record<string, any>> = {
  context?: C;
  error?: Error;
};

export type StepGuard<
  P extends Record<string, any>,
  C extends BaseContext<P>,
> = (context: C) => Promise<Result<C>>;

export interface Step {
  name: string;
  prompt: () => string;
}

export interface SimpleWorkflow<
  P extends Record<string, any>,
  C extends Record<string, any> = {},
> {
  name: string;
  init: (params: P) => Promise<Result<C>>;
  params: P;
  steps: Step[];
  workflowPrompt: () => string;
}
