Reference for how I want to build my web stack.

# Database
**Decision**: PostgreSQL

Not sure which to use between MongoDB or PostgreSQL. Probably depends on the project, so I'll start with setting up PostgreSQL (which I haven't used before), get a feel for it, and go from there.

# Web Server
**Decision**: Node/ExpressJS

Torn between mainly Golang and Node. Might try Rust. I'm interested in trying Golang more but I'd also like to be able to share libraries and code between frontend and backend, and potentially serverless options, where JS is more widely supported.

# JS Framework
**Decision**: Vue

Mainly torn between React and Vue. I'm curious how Vue has evolved since I last worked with it. I'll go with that one. Am I choosing too many things I'm less familiar with? Nah. Anyway, I'm not looking to make huge applications, and Vue seems better for smaller, focused products.

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

# Code Repository
**Decision**: GitHub

Used to it. Don't need things to be super fancy. Will just use GitHub actions and code spaces. But if I have much trouble with them I might try out GitLab.

# Hosting
**Decision**: DigitalOcean (supplemented with Cloudflare)

I've used AWS, Azure, Google Cloud, and Linode to various degrees. I suspect that I'm just going to need to make sure I don't get too dependent on anything proprietary, build an app, then try a few different services for price and UX. Regardless I expect I'll want to use their fully managed container deployment systems like Cloud Run (GCP) or App Platform (DO), save me the hassle. I'll start with DigitalOcean though since it seems like it'll be cheaper and simpler than the big three. I may experiment with managing my own instances later.

I'll also host DB on the same service as the web server. DigitalOcean supports both MongoDB and PostgreSQL.

# Telemetry/Alerting
**Decision**: Redis, Grafana, Pagerduty

I'd like some monitoring of application metrics such as HTTP response codes, and in some cases be able to provide metrics as a feature of the application. I could use a service like Datadog but... it's a bit spendy. I'm going to try rolling my own here and see what happens.

# Auth
**Decision**: Passport.js/Twilio (Sendgrid)

I'm tempted to pay for an identity service like Okta/0Auth, but I think it's best to just set up a standard SUSI form in this template and use it across different applications. I'll still need a service for reliably sending verification emails, though, and Sendgrid looks good. I also like the look of other Twilio products, like Lookup.
