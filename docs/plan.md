# Outline

Rough order of development

### Backlog

- implement auth backend fully
  - update db schema and queries
  - update auth service to use these
  - add argon2 for hashing
- maybe rename packages to have saf namespace?
- Start adding tests...
  - services/auth
  - split out shared node logic, test it
  - clients
- Add forgot frontend
- Add forgot backend, printing to console
- Add forgot integration with email service

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
  - Vitest FE Unit
  - Vitest BE Unit
  - Vitest BE Integration (w/SQLite)
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
  - Tanstack Query
  - Vue Router
  - Sentry, Error boundaries
  - ✓ Design system, components
  - Analytics et al
  - i18n
- Testing+
  - Storybook
  - Playwright
  - Nock
- Infra+
  - Kubernetes
  - Secret management
- Workflow+
  - Code formatting, quality, ESLint
  - API Versioning
  - Documentation
  - Dependency management
  - Monorepo package management
- AI+
  - Integrate with no-code tools, e.g. lovable, synthflow, repl.it, bolt.new, v0.dev
  - Try running an LLM locally, e.g. llama3 or deepseek
  - Add code review like CodeRabbit
