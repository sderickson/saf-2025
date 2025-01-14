# Overview
This is a living doc documenting what libraries and services I'm planning on using in this stack. I'll update it as I go along; I'm sure some decisions will change as I get into implementation.

## Motivation
I have a few web apps I want to build or upgrade and I'd like to share the full-stack framework between them. So I'm putting together a base framework which I can fork from.

## Principles
The libraries, software, and framework glue should be:
* **Hosting Independent**: I don't want to be dependent on or locked into specialty solutions provided by Amazon, Google, Microsoft, et al. I should be able to deploy this to anything from a fully-managed docker container service down to a stack of servers at home.
* **Industry Standard**: At least, the default pieces won't be the latest trend. Generally going for the ones that have wide adoption and fairly mature.
* **Modular**: I'm not looking to use some vertically-integrated solution, either. The glue should be provided by this framework. Direct dependencies will be kept to a minimum, and I'd like some way to enforce what may use/rely on what.
* **Cost Effective**: Try to avoid services with stingy free tiers, or software that will require a bunch of maintenance.
* **Scalable**: Even if at first one ships this to production by running the dev environment in a single instance and pointing the DNS to that, it should be able to scale from there, such as through Kubernetes.

## Features
This framework may and can include everything that is needed by pretty much any sufficiently complicated web application. At minimum things like a database and a frontend framework, but including things like batch or cron jobs, time series application metrics, authorization and identity services, ci/cd pipeline, and test frameworks.

*Ideally*, by choosing mature software and avoiding obscure features, this framework can provide a fairly comprehensive full-stack developer feature set without requiring very much maintenance. And with less coupling, pieces can be swapped out if a better library comes along or a service stops being as good/generous as it once was.

## References
Aside from the documentation itself, here are some docs I'm relying on particularly heavily to make decisions:
* [State of JS 2024](https://2024.stateofjs.com/en-US). I always like to catch up on the results of this survey and see the trajectory of the latest tools in the JS ecosystem. I also use some of their terminology.
* [Claude](https://claude.ai/). I've heard good things, and I've found this handy to get some ideas and also weigh pros/cons.
* You! Feel free to use this repo to discuss and collaborate, such as by opening issues or pull requests.

# Decisions

| Category | Choice | Might Also Try |
| - | - | - |
| [Disk Database](#disk-database) | SQLite | PostgreSQL, MongoDB |
| [In-Memory Database](#in-memory-database) | Redis | |
| [Web Server](#web-server) | Node/Express | Go, Rust |
| [DB Library](#db-library) | Drizzle | |
| [FE Framework](#frontend-framework) | Vue | React |
| [FE Libraries](#frontend-libraries) | Tanstack Query, Vue Router | Pinia, Jotai |
| [FE Language](#frontend-language) | TypeScript | |
| [CSS](#css) | DaisyUI? | |
| [Meta Framework](#meta-framework) | None | Astro |
| [Build Tool](#build-tool) | Vite | |
| [Unit Tests](#unit-tests) | Vitest | |
| [Other Testing Tools](#other-testing-tools) | Storybook, Playwright | |
| [Code Repository](#code-repository) | GitHub | GitLab |
| [Orchestration](#orchestration) | Docker-Compose | Kubernetes |
| [Observability/Alerting](#observabilityalerting) | ~LGTM, PagerDuty | |
| [Auth](#auth) | Passport.js/Sendgrid | Auth0, Keycloak, Authentik |
| [API Specs](#api-specs) | OpenAPI | gRPC-Web |
| [Reverse Proxy](#reverse-proxy) | Caddy | Nginx |



# Rationale
## Disk Database
Torn between MongoDB or PostgreSQL/SQLite. I'll start with SQLite (which I haven't used in a while), get a feel for it, should be fine for most applications, and go from there. Good opportunity to brush up on my SQL, anyway. Apache OpenDAL was recommended to check out. If needed, an app can be transitioned from SQLite to PostgreSQL.

## In-Memory Database
I'm not exactly sure how I want to go about doing things like caching, message queues, pub/sub, and alike, but an in-memory datastore is appropriate for all sorts of features like these. I honestly am not familiar with the ecosystem, and this decision is not thoroughly thought-out, but Redis seems like a perfectly good place to start. Although, digging a bit the licensing situation looks complicated. If that turns out to be an issue I'll perhaps try RabbitMQ and/or Memcached.

## Web Server
Torn between mainly Golang and Node. I'm interested in trying Golang more but the cost of learning and supporting another language doesn't seem worth it right now. Perhaps later.

## DB Library
I want to use TypeScript when interacting with the DB, and also have a system for managing DB migrations. So I need some sort of ORM which will handle these things. Most of what's out there seems fairly new... I mostly looked at Prisma, Keysely, and Drizzle. Prisma aims to add an abstraction layer over SQL and I'd rather use an ORM that's closer to SQL. Between Keysely and Drizzle, both have not reached their v1 release, but I like Drizzle's documentation better, for example how it goes over different [database migration workflows](https://orm.drizzle.team/docs/migrations) and how it supports each one.

## Frontend Framework
Mainly torn between React and Vue. I'm curious how Vue has evolved since I last worked with it. I'll go with that one. Vue also seems better for the smaller, focused products which I'll be working on.

## Frontend Libraries
I'm going to see if I can get away without a utility library like lodash. Also, reviewing the docs, Vue's state management system seems pretty modular, including Pinia and reactive. Will see how they go.

## Frontend Language
For sure TS over JS. I could consider WASM-based tools but I don't think any are mature enough for the purpose of this framework. Presumably supplemented with ESLint and some plugins. Claude suggested `@typescript-eslint/eslint-plugin`, `eslint-plugin-vue`, and `eslint-plugin-import`.

## CSS
Vue comes with some CSS features. But Tailwind was recommended and that does look like it would save some time, while being much less heavy than something like Bootstrap was (is?). Still, it would be nice to have some components and not have to make them myself. Maybe DaisyUI since it's built on Tailwind? Also recommended: Vuetify or PrimeVue (more established).

## Meta-Framework
As defined by [State of JS](https://2024.stateofjs.com/en-US/libraries/meta-frameworks/), these frameworks also run in the backend, like Next.js. Using Vue precludes choosing Next.js. I *could* try Astro but... frankly SSR is a feature I'm less interested in than others. I'll just serve static HTML for static pages, and do client-side JS for the logged-in applications for now.

## Build Tool
Vite seems pretty hot right now and also orchestrates lower-level build tools esbuild and rollup. I'd rather minimize my dev tooling work. Also, it looks like it *could* handle things like SSR that otherwise a Meta-Framework would do.

## Unit Tests
Might as well go with the testing library that integrates with Vite.

## Other Testing Tools
Will also look through other recommendations [here](https://vuejs.org/guide/scaling-up/testing.html).

## Code Repository
Used to it. Don't need things to be super fancy. Will just use GitHub actions and codespaces. But if I have much trouble with them I might try out GitLab.

## Orchestration
So, I expect for this framework, I'll test it out on various hosting services including AWS, Google Cloud, Azure, and DigitalOcean, and it should be pretty agnostic and seamless to run on any of them. I also think it's a given that I'll be using Docker containers. But then the question is how to deploy and manage these Docker containers.

I'm rather tempted to use their managed solutions. But I suspect that will make it more difficult to stay cost-effective and hosting independent. So instead I'll run and manage container orchestration as part of the framework. Kubernetes is industry standard but is probably more than I need at first. I'll start with just a single instance running Docker Compose and go from there.

## Observability/Alerting
I could use a service like Datadog but... it's a bit spendy (confirmed), and seems to overlap with what hosting services provide. I'll see how far I can get with free Pagerduty, Sentry plans, and self-hosting a minimal LGTM stack. I'll start with Loki and Grafana, hold off on Tempo for now, and use Prometheus instead of Mimir (since I've heard Prometheus recommended a couple times now). And use Sentry for frontend observability.

## Auth
I'm tempted to pay for an identity service like Okta/0Auth, but I think it's best to just set up a standard SUSI form in this template and use it across different applications. I'll still need a service for reliably sending verification emails, though, and Sendgrid looks good. I also like the look of other Twilio products, like Lookup.

I looked at a couple Authentik and Keycloak that were suggested. However, they look pretty heavy for what I need, more like Enterprise auth systems like Okta. So I'll stick with Passport.js.

## API Specs
Either gRPC-web, or OpenAPI. There are tons of tools related to OpenAPI so TBD exactly which libraries I'll use to 1) generate SDKs, 2) generate server stubs/validation, and 3) generate/host docs. Per Claude, I'll start with openapi-typescript, tsoa or Express OpenAPI Validator, and Redoc respectively. Fern was suggested but that doesn't look free.

## Reverse Proxy
I've used Nginx before, but I could use something a bit more opinionated, conventional, and well documented. Claude recommended Caddy, and for example I like the [forwarded auth](https://caddyserver.com/docs/caddyfile/directives/forward_auth) directive. So I'll start with that.

## Other Considerations
I could spend all my time planning and not building. Here are a few areas of decision-making to work on as I go, rather than figuring out everything ahead of time.

* API versioning
* CDN
* Code formatting/quality
* Cron and background (batch) jobs
* DB backups
* DB connection pooling
* Dependency management
* Development workflow
* Documentation
* Error boundaries on FE
* FE observability (analytics, gating, session replay, cookie consent)
* File uploads
* Folder structure
* i18n
* Monorepo management, npm workspaces
* Rate limiting
* Secret management, env variables

# TODOs
* Consider CRDT
* Plan out how this will be built
