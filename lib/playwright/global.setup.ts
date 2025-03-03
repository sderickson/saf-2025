import type { TestType, Page, Expect } from "@playwright/test";

console.log("playwright global setup from saf lib");
export const noop = () => {};

interface RunSetupOptions {
  healthEndpoints: string[];
  test: TestType<{ page: Page }, {}>;
  expect: Expect;
}

export const runSetup = (options: RunSetupOptions) => {
  const { healthEndpoints } = options;

  /*
  To make sure tests don't start running before services are ready, this setup
  blocks running tests until the health check for the API service returns a 200.
  This does double duty, since this endpoint is also using the auth service to
  verify that the API request is allowed.

  By default this checks api.docker.localhost/health, but if you want a different
  set of endpoints to check, pass them in as an array to this function. The endpoint
  should return a 200 if the service is healthy.
  */

  options.test("check docker service health", async ({ page }) => {
    let response;
    let attempts = 0;
    const maxAttempts = 50;
    const toCheck = healthEndpoints.slice();

    while (attempts < maxAttempts && toCheck.length > 0) {
      const url = toCheck[0];
      response = await page.goto(url);
      if (response && response.status() === 200) {
        toCheck.shift();
        continue;
      }
      await page.waitForTimeout(200);
      attempts++;
    }

    // Whatever the value is, is the endpoint that was never healthy.
    options.expect(toCheck[0]).toBeUndefined();
  });
};
