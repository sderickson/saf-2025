#!/usr/bin/env node --experimental-strip-types --disable-warning=ExperimentalWarning

import process from "node:process";
import { resolve } from "node:path";
import { getPlan, savePlanStatusContents } from "./common.ts";
const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error("Usage: kickoff <argument>");
  process.exit(1);
}

const planAbsPath = resolve(process.cwd(), args[0], "index.ts");
const workflow = await getPlan(planAbsPath);
const result = await workflow.init();
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
workflow.setContext(result.context);
await workflow.kickoff();
savePlanStatusContents(planAbsPath, workflow.serialize());
