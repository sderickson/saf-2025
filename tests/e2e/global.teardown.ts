import { test as teardown } from "@playwright/test";
import { exec } from "child_process";

teardown("shut down docker compose", async () => {
  let resolve: () => void;
  let reject: (error: Error) => void;
  const promise = new Promise<void>((r, j) => {
    resolve = r;
    reject = j;
  });
  console.log("=== Docker Teardown Start ===");
  console.log("Shutting down docker containers...");
  exec("docker compose down", (error, stdout, stderr) => {
    if (error) {
      console.error("Docker teardown failed:", error.message);
      console.error("stderr:", stderr);
      reject(error);
      return;
    }
    if (stdout) console.log("stdout:", stdout);
    if (stderr) console.log("stderr:", stderr);
    console.log("Docker teardown complete!");
    console.log("=== Docker Teardown End ===");
    resolve();
  });
  await promise;
});
