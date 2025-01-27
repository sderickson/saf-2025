import createClient from "openapi-fetch";
import type { paths } from "api-spec/dist/openapi";
export const client = createClient<paths>({
  baseUrl: "http://localhost:3000/api/",
  credentials: "include",
});
