# Outline

Rough order of development

### Backlog

- separate branch
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
  - ✓ Auth (use-case for framework features)
- Production
  - ✓ Experiment with GitHub Actions, hosting services and products, settle on one
  - ✓ Domain
- Testing
  - ✓ Vitest FE Unit
  - ✓ Vitest BE Unit
  - ✓ Integrate with GitHub Actions
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
  - Stronger security, such as express/helmet, or caddy headers
- Frontend+
  - ✓ Tanstack Query
  - ✓ Vue Router
  - ✓ Design system, components
  - Sentry, Error boundaries
  - Analytics et al
  - i18n
- Testing+
  - ✓ Playwright
  - Storybook
  - Nock
- Infra+
  - Kubernetes
  - Secret management
  - Optimize memory - fit on smallest droplet? Bun?
  - Blue/Green deployment
  - CDN
- Workflow+
  - ✓ Code formatting, quality, ESLint
  - Generate docker files from package files
  - API Versioning
  - Documentation
  - Checklists
  - Dependency management
  - Monorepo package management - nx, turborepo and alike
- AI+
  - ✓ Add code review like CodeRabbit
  - Integrate with no-code tools, e.g. lovable, synthflow, repl.it, bolt.new, v0.dev
  - Try running an LLM locally, e.g. llama3 or deepseek
