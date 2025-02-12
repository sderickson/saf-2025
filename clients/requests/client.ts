import createClient from "openapi-fetch";
import type { paths } from "@saf/specs-apis/dist/openapi";
export const client = createClient<paths>({
  baseUrl: "http://api.docker.localhost/",
  credentials: "include",
});
