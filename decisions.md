Reference for how I want to build my web stack.

# Database
**Decision**: PostgreSQL

Not sure which to use between MongoDB or PostgreSQL. Probably depends on the project, so I'll start with setting up PostgreSQL (which I haven't used before), get a feel for it, and go from there.

# Web Server
**Decision**: Node/ExpressJS

Torn between mainly Golang and Node. Might try Rust. I'm interested in trying Golang more but I'd also like to be able to share libraries and code between frontend and backend.

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
