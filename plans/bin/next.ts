#!/usr/bin/env node --experimental-strip-types

import { resolve } from "node:path";
import { WorkflowRunner } from "./runner.ts";
import {
  loadPlanStatusContents,
  getPlan,
  savePlanStatusContents,
  getActivePlanPath,
} from "./common.ts";
const args = process.argv.slice(2);

const planAbsPath = args[0] ? resolve(args[0]) : getActivePlanPath();
const { workflow } = await getPlan(planAbsPath);
const runner = new WorkflowRunner(workflow);
const planStatus = loadPlanStatusContents(planAbsPath);
if (!planStatus) {
  console.error(
    "Plan status file does not exist. Did you run 'kickoff' first?",
  );
  process.exit(1);
}

runner.deserialize(planStatus);
await runner.goToNextStep();
savePlanStatusContents(planAbsPath, runner.serialize());
