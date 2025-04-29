#!/usr/bin/env node --experimental-strip-types

import { resolve } from "node:path";
import {
  loadPlanStatusContents,
  getPlan,
  getActivePlanPath,
} from "./common.ts";
const args = process.argv.slice(2);

const planAbsPath = args[0] ? resolve(args[0]) : getActivePlanPath();
const workflow = await getPlan(planAbsPath);
const planStatus = loadPlanStatusContents(planAbsPath);
if (!planStatus) {
  console.error(
    "Plan status file does not exist. Did you run 'kickoff' first?",
  );
  process.exit(1);
}

workflow.deserialize(planStatus);
workflow.print(await workflow.getStatusPrompt());
