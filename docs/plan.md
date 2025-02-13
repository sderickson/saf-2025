# Outline

Rough order of development

### Scratch

So for deployments, here's my plan:

- To minimize number of services I'm using, I'll publish to GitHub's container store
- To start, I'll just work on deploying to a single virtual instance via ssh
- I'd like to minimize the effort to set up an instance/domain. Pretty much buy a domain, point it to the nameservers.

So the process for getting a fork of this repo to be running will be:

1. Purchase instance, get/store SSH key for it (thinking 1Password)
2. Purchase domain, point it at instance provider's nameservers
3. Update domain in repo wherever the source of truth is
4. Add SSH key to repo secrets

At that point, the workflow should just work, to ssh into the instance, install anything needed, then run the service.

### Backlog

- Deployments
  - Buy domain
  - Create DO droplet
  - Figure out how to run docker-compose in production mode
  - Test also locally with hosts updated to (hopefully) make sure things will work
  - Write a script which will
    - install anything fundamental (e.g. docker) if not present
    - start the server if it's not already running
    - do a zero-downtime deploy with docker-compose blue/green setup if it _is_ already running
  -
- Add forgot email flow
- Add verify email flow

### Core

Once all of this is done, should start using this in actual applications.

- Local
  - ✓ Vite/Vue
  - ✓ Node/Express
  - ✓ SQLite
  - ✓ Docker Compose
  - ✓ API Specs
  - Auth (use-case for framework features)
- Production
  - Experiment with GitHub Actions, hosting services and products, settle on one
  - Domain, CDN
- Testing
  - ✓ Vitest FE Unit
  - ✓ Vitest BE Unit
  - Integrate with GitHub Actions
- Observability
  - LGTM
  - PagerDuty

### Extended

What follows can largely be done in any order.

- Backend+
  - Redis
  - Background jobs
  - Cron jobs
  - Backups
  - Uploads
  - Rate limiting
- Frontend+
  - ✓ Tanstack Query
  - ✓ Vue Router
  - Sentry, Error boundaries
  - ✓ Design system, components
  - Analytics et al
  - i18n
- Testing+
  - Storybook
  - ✓ Playwright
  - Nock
- Infra+
  - Kubernetes
  - Secret management
- Workflow+
  - ✓ Code formatting, quality, ESLint
  - API Versioning
  - Documentation
  - Dependency management
  - Monorepo package management - nx, turborepo and alike
- AI+
  - Integrate with no-code tools, e.g. lovable, synthflow, repl.it, bolt.new, v0.dev
  - Try running an LLM locally, e.g. llama3 or deepseek
  - ✓ Add code review like CodeRabbit
