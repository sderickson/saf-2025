import createClient from "openapi-fetch";
import type { paths } from "api-spec/dist/openapi";
export const client = createClient<paths>({
  baseUrl: "http://localhost/api/",
  credentials: "include",
});
