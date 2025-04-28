import StateMachine from "javascript-state-machine";
import type { Workflow } from "../types.ts";
import { resolve } from "path";

const options = {
  type: "object",
  properties: {
    path: {
      type: "string",
    },
  },
  required: ["path"],
};

const AddTestsWorkflow = StateMachine.factory({
  init: "start",
  transitions: [
    { name: "orient", from: "start", to: "oriented" },
    { name: "add-tests", from: "oriented", to: "implemented" },
    { name: "fix-tests", from: "implemented", to: "done" },
  ],
  data: function (path: string) {
    // const absPath = path.startsWith("/") ? path : resolve(process.cwd(), path);
    const absPath = resolve(path);
    console.log("Adding tests to", absPath);
    return {
      path: absPath,
    };
  },
  methods: {
    prompt: function () {
      const taskPrompt = `
      You are adding tests to ${this.path}.
      `;

      let stepPrompt = "";
      switch (this.state) {
        case "start":
          stepPrompt = "Please go to the package and run the tests.";
          break;
        case "oriented":
          stepPrompt = "Please now implement the tests.";
          break;
        case "implemented":
          stepPrompt = "Please now run the tests and fix any issues.";
          break;
      }

      return `${taskPrompt}\n${stepPrompt}`;
    },
  },
});

export const addTestsWorkflow: Workflow = {
  name: "add-tests",
  options,
  factory: AddTestsWorkflow,
};
