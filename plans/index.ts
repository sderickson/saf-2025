// Export public APIs from here

import { AddTestsWorkflow } from "./workflows/fix-tests.ts";
import type { SimpleWorkflow } from "./types.ts";

const workflows: SimpleWorkflow<any, any>[] = [AddTestsWorkflow];

export { workflows };
