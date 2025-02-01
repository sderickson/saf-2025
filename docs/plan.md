# Outline

Rough order of development

### Backlog

- Start adding tests...
  - Fix a few issues that came up when adding tests to dbs/auth
    - Had to go to an older version of better-sqlite3 to get it to run on mac. Either get the newer version to work, or switch to libsql as the driver.
    - Also had to add build tools to the dockerfile. Can we get away without those? Docker doesn't even need to run tests, can these deps just not be installed?
    - Finally, tests depend on running NODE_ENV=test, which is not ideal. Maybe switch to having the env include the path to the sqlite file instead.
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
- AI+
  - Integrate with no-code tools, e.g. lovable, synthflow, repl.it, bolt.new, v0.dev
  - Try running an LLM locally, e.g. llama3 or deepseek
  - Add code review like CodeRabbit
