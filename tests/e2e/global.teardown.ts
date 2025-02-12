import { test as teardown } from "@playwright/test";
import { exec } from "child_process";

teardown("shut down docker compose", async ({}) => {
  let resolve: () => void;
  let reject: (error: Error) => void;
  const promise = new Promise<void>((r, j) => {
    resolve = r;
    reject = j;
  });
  console.log(">>>>>>>>>>>>>>>>>>>");
  console.log("Shutting down docker containers...");
  exec("docker compose down", (error, stdout, stderr) => {
    console.log("Docker teardown complete!");
    console.log(">>>>>>>>>>>>>>>>>>>");
    resolve();
  });
  await promise;
});
