#!/usr/bin/env node --experimental-strip-types

import process from "node:process";

const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error("Usage: kickoff <argument>");
  process.exit(1);
}

const planArgument = args[0];

console.log(`Kicking off plan with argument: ${planArgument}`);
// TODO: Implement plan kickoff logic
