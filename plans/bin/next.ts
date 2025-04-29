#!/usr/bin/env node --experimental-strip-types --disable-warning=ExperimentalWarning

import { resolve } from "node:path";
import {
  loadPlanStatusContents,
  getPlan,
  savePlanStatusContents,
  getActivePlanPath,
} from "./common.ts";
const args = process.argv.slice(2);

const planAbsPath = args[0] ? resolve(args[0]) : getActivePlanPath();
if (!planAbsPath) {
  console.error("No plan path provided, and there is none active.");
  process.exit(1);
}
const workflow = await getPlan(planAbsPath);
const planStatus = loadPlanStatusContents(planAbsPath);
if (!planStatus) {
  console.error(
    "Plan status file does not exist. Did you run 'kickoff' first?",
  );
  process.exit(1);
}

workflow.deserialize(planStatus);
await workflow.goToNextStep();
savePlanStatusContents(planAbsPath, workflow.serialize());
