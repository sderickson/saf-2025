import createClient from "openapi-fetch";
import type { types } from "@saf-2025/specs-apis";
export const client = createClient<types.paths>({
  fetch: (request: Request) => {
    // this is little noop wrapper is required for msw to work
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("_csrf_token="))
      ?.split("=")[1];
    if (csrfToken) {
      request.headers.set("X-CSRF-Token", csrfToken);
    }
    return fetch(request);
  },
  baseUrl: `${document.location.protocol}//api.${document.location.host}`,
  credentials: "include",
});
