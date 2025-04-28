#!/usr/bin/env node --experimental-strip-types

import process from "node:process";

const args = process.argv.slice(2);
const optionalArgument = args[0]; // Will be undefined if no arg is provided

if (optionalArgument) {
  console.log(
    `Getting next step for plan with optional argument: ${optionalArgument}`,
  );
} else {
  console.log("Getting next step for current plan...");
}
// TODO: Implement next step logic
