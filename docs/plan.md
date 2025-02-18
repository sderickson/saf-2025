# Outline

Rough order of development

### Backlog

- This branch

  - Add blue-green deploy script
    - Make sure site never goes down
  - Add workflow which ssh's into the virtual instance
  - Update to build/publish images
  - Update to run bootstrap script after build/publish
  - Switch workflow to be on main branch
  - Merge branch

- next branch

  - Create new script in deploy/instance which generates all the docker files from package files

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
