#!/usr/bin/env node --experimental-strip-types --disable-warning=ExperimentalWarning

console.log("Listing workflows...");

import { workflows } from "../index.ts";

workflows.forEach((workflow) => {
  console.log(`* ${workflow.name}`);
});

// TODO: Implement plan listing logic
