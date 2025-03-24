import { createClient } from "openapi-fetch";
import type { paths } from "@saf-2025/auth-spec";

export const client = createClient<paths>({
  baseUrl: "/api",
});
