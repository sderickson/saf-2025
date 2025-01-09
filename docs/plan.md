# Outline

Rough order of development

### Backlog
* Add some usage docs
* Get Node on TS
* Integrate Node with Docker watch mode
* Give db some organization
* See how one might restrict imports
* Figure out require/import
* Incorporate some of Express' best practices

### Core
Once all of this is done, should start using this in actual applications.

* Local
    * ✓ Vite/Vue
    * ✓ Node/Express
    * ✓ SQLite
    * API Specs
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
