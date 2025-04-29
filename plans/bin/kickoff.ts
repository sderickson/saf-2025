#!/usr/bin/env node --experimental-strip-types --disable-warning=ExperimentalWarning

import process from "node:process";
import { resolve } from "node:path";
import { getPlan, savePlanStatusContents } from "./common.ts";
import { existsSync } from "node:fs";
const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error("Usage: kickoff <argument>");
  process.exit(1);
}

if (!existsSync(resolve(process.cwd(), args[0]))) {
  console.error(`Plan folder "${args[0]}" does not exist`);
  process.exit(1);
}

const planAbsPath = resolve(process.cwd(), args[0], "index.ts");
if (!existsSync(planAbsPath)) {
  console.error(
    `Plan folder "${args[0]}" does not have an "index.ts" to import`,
  );
  process.exit(1);
}
const workflow = await getPlan(planAbsPath);
const result = await workflow.init();
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
workflow.setContext(result.context);
await workflow.kickoff();
savePlanStatusContents(planAbsPath, workflow.serialize());
