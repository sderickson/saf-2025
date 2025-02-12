import createClient from "openapi-fetch";
import type { paths } from "@saf/specs-apis/dist/openapi";
console.log("api.docker.localhost");
export const client = createClient<paths>({
  baseUrl: "http://api.docker.localhost/",
  credentials: "include",
});
