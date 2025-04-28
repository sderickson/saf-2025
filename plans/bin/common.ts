import { dirname, resolve } from "node:path";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

export const getPlan = async (planAbsPath: string) => {
  if (!existsSync(planAbsPath)) {
    console.error(`Plan file does not exist: ${planAbsPath}`);
    process.exit(1);
  }

  const plan = await import(planAbsPath);

  if (!plan.default) {
    console.error(`Plan file does not export a default plan: ${planAbsPath}`);
    process.exit(1);
  }

  if (!plan.default.workflow) {
    console.error(`Plan file does not export a workflow: ${planAbsPath}`);
    process.exit(1);
  }

  if (!plan.default.params) {
    console.error(`Plan file does not export params: ${planAbsPath}`);
    process.exit(1);
  }

  const workflow = plan.default.workflow;
  const params = plan.default.params;

  return { workflow, params };
};

export const getPlanStatusFilePath = (planAbsPath: string) => {
  const planDir = dirname(planAbsPath);
  return resolve(planDir, "plan-status.json");
};

export const loadPlanStatusContents = (planAbsPath: string): string | null => {
  const planStatusFilePath = getPlanStatusFilePath(planAbsPath);
  if (!existsSync(planStatusFilePath)) {
    return null;
  }
  return readFileSync(planStatusFilePath, "utf8");
};

export const savePlanStatusContents = (
  planAbsPath: string,
  contents: string,
) => {
  const planStatusFilePath = getPlanStatusFilePath(planAbsPath);
  writeFileSync(planStatusFilePath, contents);
};
