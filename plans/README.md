# Concepts

- Step: A single task that's part of a workflow - comes with a single prompt.
- Workflow: An abstract series of steps, which are executed by a single agent.
- Plan: A list of workflows with params, to build a feature, fix a bug, etc.

# Locations

Right now everything is in one `plans` directory. However, this implementation is expected to go to the following locations:

- `workflows`: Most workflows should be in separate packages, for workflows that are related to the features and docs they contain.
- `bin`: Should go to a "@saflib/workflows" package, and the commands should be in the package.json's `bin` object.
- `20xx-xx-xx-feature-name`: These should stay where they are: in the project repo they are related to.
