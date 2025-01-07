# Outline

Rough order of development

### Core
Once all of this is done, should start using this in actual applications.

* Local
    * ✓ Vite/Vue
    * Node/Express
    * SQLite
    * API Specs (experiment with npm workspaces here)
    * Docker Compose
    * Auth (use-case for framework features)
* Production
    * Experiment with GitHub Actions, hosting services and products, settle on one
    * Domain, CDN
* Testing
    * Vitest FE Unit
    * Vitest BE Unit
    * Vitest BE Integration (w/SQLite)
    * Integrate with GitHub Actions
* Observability
    * LGTM
    * PagerDuty

### Extended
What follows can largely be done in any order.

* Backend+
    * Redis
    * Background jobs
    * Cron jobs
    * Backups
    * Uploads
    * Rate limiting
* Frontend+
    * Tanstack Query
    * Vue Router
    * Sentry, Error boundaries
    * Design system, components
    * Analytics et al
    * i18n
* Testing+
    * Storybook
    * Playwright
    * Nock
* Infra+
    * Kubernetes
    * Secret management
* Workflow+
    * Code formatting, quality
    * API Versioning
    * Documentation
    * Dependency management