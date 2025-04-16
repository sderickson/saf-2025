# Outline

Working doc for keeping track of what main features are built, and what is still be done.
Also throw in some interesting things to try as I find them.

### Backlog

- Auth
  - Add forgot email flow
  - Add verify email flow
- To migrate from product repos
  - npm scripts
- To create to reduce manual work for each product
  - generate docker and compose files from package.json
  - generate vite config from spa manifest
- Static analysis
  - Apply linting to entire repo, not just clients
  - Add typescript checking to CI for whole repo
  - Add linter to enforce exact file extensions
- Docs
  - Add doc manifest generated from lib folder entries

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
  - Prometheus, Loki, OpenTelemetry
  - PagerDuty

### Extended

What follows can largely be done in any order.

- Backend+
  - Redis
  - Background jobs
  - ~ Cron jobs
  - Backups
  - Uploads
  - ~ Rate limiting
  - ✓ Stronger security, such as express/helmet, or caddy headers
  - ✓ Scopes
  - Workers (e.g. Cloudflare Workers)
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
  - Nix
  - Secret management
  - ~ Optimize memory
  - Blue/Green deployment
  - CDN
- Workflow+
  - ✓ Code formatting, quality, ESLint
  - ~ Generate docker files from package files, general package-driven development
  - API Versioning
  - ✓ Documentation
  - ✓ Checklists
  - Dependency management
  - Monorepo package management - nx, turborepo and alike
  - Try out some methodology [here](https://generaitelabs.com/one-agentic-coding-workflow-to-rule-them-all/)
- AI+
  - ✓ Add code review like CodeRabbit
  - Integrate with no-code tools, e.g. lovable, synthflow, repl.it, bolt.new, v0.dev
  - Try running an LLM locally, e.g. llama3 or deepseek
  - Try Roo code
  - Try Cline
