import {
  AddTestsWorkflow,
  type AddTestsWorkflowParams,
} from "../workflows/add-tests.ts";
import { resolve } from "node:path";

const plan = {
  workflow: AddTestsWorkflow,
  params: {
    path: resolve(
      import.meta.dirname,
      "../../saflib/auth-db/src/queries/email-auth.ts",
    ),
  } satisfies AddTestsWorkflowParams,
};

export default plan;
