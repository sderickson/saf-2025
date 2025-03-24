import { createClient } from "openapi-fetch";
import type { paths } from "@saf/auth-spec";

export const client = createClient<paths>({
  baseUrl: "/api",
});
