import createClient from "openapi-fetch";
import type { types } from "@saf-2025/specs-apis";
export const client = createClient<types.paths>({
  baseUrl: `${document.location.protocol}//api.${document.location.host}`,
  credentials: "include",
});
