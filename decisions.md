This is a living doc documenting what libraries and services I'm planning on using in this stack. I'll update it as I go along; I'm sure some decisions will change as I get into implementation.

# Context
I have a few web apps I want to build or upgrade and I'd like to share the full-stack framework between them. So I'm putting together a base framework which I can fork from.

## Principles
The libraries and software used should be:
* **Platform Independent**: I don't want to be dependent on or locked into specialty solutions provided by Amazon, Google, Microsoft, et al.
* **Industry Standard**: At least, the default pieces won't be the latest trend. Generally going for the ones that have wide adoption and fairly mature.
* **Modular**: I'm not looking to use some vertically-integrated solution, either. The glue should be provided by this framework.

For the glue that is this framework itself, I'm aiming for:
* **Loose Coupling**: I don't want it to be too hard to swap out pieces. So direct dependencies will be kept to a minimum, and 

## References
Aside from the documentation itself, here are some docs I'm relying on particularly heavily to make decisions:
* [State of JS 2024](https://2024.stateofjs.com/en-US). I always like to catch up on the results of this survey and see the trajectory of the latest tools in the JS ecosystem. I also use some of their terminology.
* [Claude](https://claude.ai/). I've heard good things, and I've found this handy to get some ideas and also weigh pros/cons.
* You! Feel free to use this repo to discuss and collaborate.

# Decisions
## Database: PostgreSQL
Torn between MongoDB or PostgreSQL. Probably depends on the project, so I'll start with setting up PostgreSQL (which I haven't used before), get a feel for it, and go from there.

# Web Server
**Decision**: Node/ExpressJS

Torn between mainly Golang and Node. Might try Rust. I'm interested in trying Golang more but I'd also like to be able to share libraries and code between frontend and backend, and potentially serverless options, where JS is more widely supported.

# JS Framework
**Decision**: Vue

Mainly torn between React and Vue. I'm curious how Vue has evolved since I last worked with it. I'll go with that one. Am I choosing too many things I'm less familiar with? Nah. Anyway, I'm not looking to make huge applications, and Vue seems better for smaller, focused products.

# Other JS Libs
**Decision**: Tanstack Query, Vue Router, Tanstack Query, maybe Pinia?

I'm going to see if I can get away without a utility library like lodash. Also, reviewing the docs, Vue's state management system seems pretty modular, including Pinia and reactive. Will see how they go.

# Frontend Languge
**Decision**: TypeScript

For sure.

# Meta-Framework
**Decision**: None

Using Vue precludes choosing Next.js. I *could* try Astro but I want to avoid web servers doing work when serving a page. I'll just server static HTML for static pages, and bootstrap the application for dynamic pages. Keep it simple.

# Build Tool
**Decision**: Vite

Vite seems pretty hot right now and also orchestrates lower-level build tools. I'd rather minimize my dev tooling work. Also, it looks like it *could* handle things like SSR that otherwise a Meta-Framework would do.

# Template HTML
**Decision**: Handlebars

Instead of rendering server-side for each static, logged-out page request in production, I'll build static HTML as part of deployment and serve that. But I'd still like a templating system to share common HTML such as header, footer. I kind of wonder if I can get Vite to do this for me... But that feels OP. I could use EJS but again more power than I need. I could use pug but I'd rather have a template which falls back nicely to HTML.

# Unit Tests
**Decision**: Vitest

Might as well go with the testing library that integrates with Vite.

# Other Testing Tools
**Decision**: Storybook, Playwright

Will also look through other recommendations [here](https://vuejs.org/guide/scaling-up/testing.html).

# Code Repository
**Decision**: GitHub

Used to it. Don't need things to be super fancy. Will just use GitHub actions and code spaces. But if I have much trouble with them I might try out GitLab.

# Hosting
**Decision**: DigitalOcean (supplemented with Cloudflare)

I've used AWS, Azure, Google Cloud, and Linode to various degrees. I suspect that I'm just going to need to make sure I don't get too dependent on anything proprietary, build an app, then try a few different services for price and UX. Regardless I expect I'll want to use their fully managed container deployment systems like Cloud Run (GCP) or App Platform (DO), save me the hassle. I'll start with DigitalOcean though since it seems like it'll be cheaper and simpler than the big three. I may experiment with managing my own instances later.

I'll also host DB on the same service as the web server. DigitalOcean supports both MongoDB and PostgreSQL.

# Telemetry/Alerting
**Decision**: Redis (self hosted), Grafana (self hosted), Pagerduty, Sentry

I'd like some monitoring of application metrics such as HTTP response codes, and in some cases be able to provide metrics as a feature of the application. I could use a service like Datadog but... it's a bit spendy, and seems to overlap with what hosting services provide. I'm going to try rolling my own here and see what happens. And how far I can get with free Pagerduty, Sentry plans.

# Auth
**Decision**: Passport.js/Twilio (Sendgrid)

I'm tempted to pay for an identity service like Okta/0Auth, but I think it's best to just set up a standard SUSI form in this template and use it across different applications. I'll still need a service for reliably sending verification emails, though, and Sendgrid looks good. I also like the look of other Twilio products, like Lookup.

# API Specs
**Decision**: Swagger?

I'm surprised Swagger doesn't autogen a node or express server! At least, the node one is archived. (TODO)
