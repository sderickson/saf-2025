import { dirname, resolve, join } from "node:path";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { SimpleWorkflow } from "../workflow.ts";

export const getPlan = async (
  planAbsPath: string,
): Promise<SimpleWorkflow<any, any>> => {
  if (!existsSync(planAbsPath)) {
    throw new Error(`Plan file does not exist: ${planAbsPath}`);
  }

  const plan = await import(planAbsPath);

  if (!plan.default) {
    throw new Error(`Plan file does not export a default plan: ${planAbsPath}`);
  }

  if (!(plan.default instanceof SimpleWorkflow)) {
    throw new Error(
      `Plan file does not export a workflow instance: ${planAbsPath}`,
    );
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
  if (!existsSync(planStatusFilePath)) {
    return null;
  }
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

export const getAbsPathFromProjectPath = (projectPath: string) => {
  let projectDir = process.cwd();
  console.log("projectDir", projectDir);
  console.log("projectPath", projectPath);
  while (!existsSync(join(projectDir, projectPath)) && projectDir !== "/") {
    console.log("checked", join(projectDir, projectPath));
    projectDir = dirname(projectDir);
    console.log("projectDir", projectDir);
  }
  if (projectDir === "/") {
    throw new Error(`File does not exist: ${projectPath}`);
  }
  return join(projectDir, projectPath);
};
