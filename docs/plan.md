# Outline

Rough order of development

### Backlog

- Build frontend basic register/login form. - Have react-query send the data, handle error
  - Set up backend route for registering a user
  - Create the database schema for users signing up with passwords
  - Do the same above but for logging in
  - And the forgot page
  - And the logout page
- Build backend for creating a user and also logging in
- Add caddy intermediary

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
