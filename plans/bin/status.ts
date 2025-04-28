#!/usr/bin/env node --experimental-strip-types

import { resolve } from "node:path";
import { WorkflowRunner } from "./runner.ts";
import { loadPlanStatusContents, getPlan } from "./common.ts";
const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error("Usage: status <plan-path>");
  process.exit(1);
}

const planAbsPath = resolve(args[0]);
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
await runner.printStatusPrompt();
