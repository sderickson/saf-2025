export interface BaseContext<P extends Record<string, any>> {
  print: (message: string) => void;
  params: P;
}

export type Result<C extends Record<string, any>> = {
  context: C;
  success: boolean;
};

export type StepGuard<
  P extends Record<string, any>,
  C extends BaseContext<P>,
> = (context: C) => Promise<Result<C>>;

export interface Step<P extends Record<string, any>, C extends BaseContext<P>> {
  name: string;
  prompt: (context: C) => string;
  guard?: StepGuard<P, C>;
}

export interface SimpleWorkflow<
  P extends Record<string, any>,
  C extends Record<string, any> = {},
> {
  name: string;
  init: (params: P) => Promise<Result<C>>;
  params: P;
  steps: Step<P, C & BaseContext<P>>[];
  usage: string;
  workflowPrompt: (context: C & BaseContext<P>) => string;
}
