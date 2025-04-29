import { dirname, resolve } from "node:path";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { SimpleWorkflow } from "../workflow.ts";

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

  if (!(plan.default instanceof SimpleWorkflow)) {
    console.error(
      `Plan file does not export a workflow instance: ${planAbsPath}`,
    );
    process.exit(1);
  }

  return plan.default as SimpleWorkflow<any, any>;
};

export const getPlanStatusFilePath = (planAbsPath: string) => {
  const planDir = dirname(planAbsPath);
  return resolve(planDir, "plan-status.json");
};

export const getActivePlanPathPath = () => {
  const planDir = process.cwd();
  return resolve(planDir, ".active-plan");
};

export const getActivePlanPath = () => {
  const planStatusFilePath = getActivePlanPathPath();
  return readFileSync(planStatusFilePath, "utf8");
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
  writeFileSync(getActivePlanPathPath(), planAbsPath);
};
