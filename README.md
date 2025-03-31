# saf-2025

The actual shared code lives in the [saflib repo](https://github.com/sderickson/saflib). This repository is for:

* Demonstrating how to use the framework
* A way to develop the framework

Features in `saflib` are built in tandem with this repository to make sure they'll work, and then what is built serves as an example. If you'd rather •use* the framework, see the [documentation](https://docs.saf-demo.online/#setup).

The code for this repo runs at [https://saf-online.com/](https://saf-online.com/).

## Setup

To use this repository, you need **Node v22** and **Docker** installed. Then all the `npm` scripts should work for you.

## Use

To work on the framework itself, seek out the various `package.json` files and run the npm scripts. They mostly fall into these categories:

- `npm run test`, `npm run test:watch`, and `npm run test:coverage` - vitest or playwright-based commands
- `npm run generate` - for tools like `drizzle` and `openapi` that create build files
- `./deploy/instance` has a bunch of scripts for running docker in various configurations for local development, and pushing deployments to remote production instances
- `./test/e2e` has some playwright-specific commands
