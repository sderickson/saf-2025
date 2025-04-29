export type Result<C extends Record<string, any>> = {
  context?: C;
  error?: Error;
};

export interface Step {
  name: string;
  prompt: () => string;
}
