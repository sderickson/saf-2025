import createClient from "openapi-fetch";
import type { paths } from "../specs/apis/dist/openapi";
export const client = createClient<paths>({
  baseUrl: "http://localhost/api/",
  credentials: "include",
});
