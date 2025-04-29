import { AddTestsWorkflow } from "../workflows/add-tests.ts";
import { resolve } from "node:path";

export default new AddTestsWorkflow({
  path: resolve(
    import.meta.dirname,
    "../../saflib/auth-db/src/queries/email-auth.ts",
  ),
});
