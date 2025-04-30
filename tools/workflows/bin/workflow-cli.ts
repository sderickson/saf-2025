#!/usr/bin/env node --experimental-strip-types --disable-warning=ExperimentalWarning

import { runWorkflowCli } from "@saflib/workflows";
import { workflows } from "../index.ts";

runWorkflowCli(workflows);
