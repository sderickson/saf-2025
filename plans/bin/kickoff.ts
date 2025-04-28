#!/usr/bin/env node --experimental-strip-types

import process from "node:process";
import { resolve } from "node:path";
import { WorkflowRunner } from "./runner.ts";
import { getPlan, savePlanStatusContents } from "./common.ts";
const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error("Usage: kickoff <argument>");
  process.exit(1);
}

const planAbsPath = resolve(process.cwd(), args[0], "index.ts");
const { workflow, params } = await getPlan(planAbsPath);
const runner = new WorkflowRunner(workflow);
await runner.kickoff(params);
savePlanStatusContents(planAbsPath, runner.serialize());
