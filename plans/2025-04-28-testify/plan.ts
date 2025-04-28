import {
  AddTestsWorkflow,
  type AddTestsWorkflowParams,
} from "../workflows/fix-tests.ts";
import { resolve } from "node:path";

const plan = {
  workflow: AddTestsWorkflow,
  params: {
    path: resolve(import.meta.dirname, "../../dbs/main/src/queries/todos.ts"),
  } satisfies AddTestsWorkflowParams,
};

export default plan;
