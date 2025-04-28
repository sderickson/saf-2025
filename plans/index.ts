// Export public APIs from here

import { addTestsWorkflow } from "./workflows/fix-tests.ts";
import type { Workflow } from "./types.ts";

const workflows: Workflow[] = [addTestsWorkflow];

export { workflows };
