# SAF-2025 Framework Authentication Roadmap

## Overview

This roadmap outlines the necessary changes to the SAF-2025 framework to support:

1. Refactoring authentication components into reusable libraries
2. Adding scope-based authorization
3. Creating an admin interface for user management

## Projects

### 1. Auth Database Library (`auth-db-library`)

Move authentication database from `saf-2025/dbs/auth` to a library package.

**Key Changes:**

- Create new package `@saflib/auth-db` in `lib/`
- Move SQLite database implementation
- Ensure database file can be shared between services
- Update connection handling for multi-service support
- Add documentation for database sharing

STATUS: DONE. [Docs](../2025-03-26-auth-db-refactor/)

### 2. Auth Service Library (`auth-service-library`)

Refactor authentication service into a reusable library.

**Key Changes:**

- Create new package `@saflib/auth-service` in `lib/`
- Move core authentication logic from `services/auth/app.ts`
- Extract passport configuration and strategies
- Create clean service interface for library consumers
- Add documentation for service integration

STATUS: DONE. [Docs](../2025-03-27-auth-service-library/)

### 3. Auth Scopes (`auth-scopes`)

Add scope-based authorization to the authentication system.

**Key Changes:**

- Add permissions table to auth database
- Update user sessions to include scopes
- Modify auth verification to check scopes
- Update `lib/node-express/src/middleware/auth.ts`
- Update `specs/rpcs/protos/envelope.proto`
- Add scope validation middleware
- Add documentation for scope usage

### 4. Admin SPA (`auth-admin`)

Create administrative interface for user management.

**Key Changes:**

- Create new SPA following `lib/vue-spa/docs/add-spa.md`
- Implement user listing and search
- Add user detail view
- Create scope management interface
- Add necessary API endpoints:
  - GET /users (list/search)
  - GET /users/:id (detail)
  - PUT /users/:id/scopes (update)

### 5. API Scopes (`api-scopes`)

Add scope enforcement to OpenAPI specification.

**Key Changes:**

- Extend OpenAPI specification to include scope requirements
- Update `lib/node-express/src/middleware/openapi.ts`
- Add scope validation to request processing
- Add "authenticated" pseudo-scope
- Update documentation for scope specification

### 6. ESLint Standardization (`eslint-standards`)

Standardize ESLint rules across the entire monorepo to enforce consistent code style and import patterns.

**Key Changes:**

- Extend Vue ESLint rules to all TypeScript files in the repository
- Add and configure `import/extensions` rule to:
  - Enforce explicit file extensions in imports
  - Ensure extensions match source files (no `.js` for `.ts` files)
  - No extension inference or transpilation assumptions
- Update `saf-2025/lib/monorepo/eslint.config.js` to:
  - Apply consistent rules across all directories
  - Remove client-specific configurations where possible
  - Add proper parser options for Vue files
- Add documentation for ESLint configuration and rules
- Create automated fix scripts for common violations

### 7. Integration Testing Infrastructure (`integration-testing`)

Create comprehensive integration testing infrastructure for external service integrations.

**Key Changes:**

- Create new package `@saflib/integration-testing` in `lib/`
- Implement Nock-based HTTP mocking infrastructure:
  - Standard mock setup patterns
  - Recording/replay capabilities
  - Type-safe mock definitions
- Add webhook testing support:
  - Local webhook receiver infrastructure
  - Mock webhook sender for testing outbound webhooks
  - Timing and retry testing utilities
- Create documentation:
  - Mock setup and usage patterns
  - Webhook testing patterns
  - Best practices for integration tests
  - Example implementations

## Dependencies

Projects should be completed in this order:

1. `auth-db-library`
2. `auth-service-library`
3. `auth-scopes`
4. `api-scopes`
5. `eslint-standards`
6. `auth-admin`
7. `integration-testing` (can be developed independently)

## Timeline Considerations

- Database refactoring should be done first to minimize disruption
- Service library can be developed in parallel with database changes
- Scope implementation requires both database and service libraries
- Admin SPA should be last as it depends on all other components
