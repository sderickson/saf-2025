# saf-2025

This is Scott's Application Framework - I built it for me but also I'm making this repo public for people to use and play around with as they like.

SAF is a full-featured web application framework using my preferred libraries and services. It is a composite of many libraries and services, though I try to use more of the former than the latter. As much as possible I want applications built with this to be:

* **Self-Contained**. The app should run with little setup or dependencies on outside services except for things that are really essential, such as dependable, trusted email services.
* **Feature Complete**. Provide the sorts of features you'd expect as an application developer or engineering manager to have on hand such as CI/CD pipeline, common backend services like background tasks or message queues, and code health reports. It should feel mature and modern.
* **Batteries Included**. Provides common features, services, and utilities. These might be simple libraries like common Express middleware configuration, or entire E2E services like sign-up/sign-in flows and an identity service.
* **Easy to Update**. I want to be able to pretty quickly build a new common tool in this repo and then share it with all the applications that use this framework. Or update things to the latest libraries. That's partly on the application, though, to have thorough and well-balanced testing.
* **Built for AI**. This is sort of my playground to experiment with and share methodologies and tools. In particular I'm organizing and documenting things so AI can be pointed at a doc or two and know what to do without having to scan the whole project.

## Docs
* [Plan](./docs/plan.md) - kept up to date on current feature status, backlog
* [Decisions](./docs/decisions.md) - including rationale on which tech I'll be incorporating (first, anyway)
* [AI Learnings](./docs/ai-learnings.md) - my current outlook and takeaways on AI for development, product, and process

## Setup
To use this repository, you need **Node v22** and **Docker** installed. Then all the `npm` scripts should work for you.

## Use
To work on the framework itself, seek out the various `package.json` files and run the npm scripts. They mostly fall into these categories:

* `npm run test`, `npm run test:watch`, and `npm run test:coverage` - vitest or playwright-based commands
* `npm run generate` - for tools like `drizzle` and `openapi` that create build files
* `./deploy/instance` has a bunch of scripts for running docker in various configurations for local development, and pushing deployments to remote production instances
* `./test/e2e` has some playwright-specific commands

To use the framework in an application... I'm still playing around with that but I'm finding it promising to have the entire `saf-2025` as a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules), and then otherwise sharing a similar layout as this repository, minus the things that are the shared tools (especially `/lib` and `/auth` stuff). I'll create a template in the future for a more streamlined setup.
