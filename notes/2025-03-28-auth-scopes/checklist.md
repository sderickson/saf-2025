# Auth Scopes Implementation Checklist

## Planning Phase

- [x] Set up a new branch in the monorepo

  - [x] Checkout the main branch
  - [x] Pull the latest changes
  - [x] Create a new branch with the current date and the name of the feature, e.g. `2025-03-28-auth-scopes`
  - [x] **Review Point**

- [x] Write specification

  - [x] Make a copy of the [./feature-spec-template.md](./feature-spec-template.md) document, put it in /notes/2025-03-28-auth-scopes/spec.md
  - [x] Fill in each section
  - [x] **Review Point**

- [x] Update checklist

  - [x] Update the checkbox contents for what is necessary for this feature based on the spec
  - [x] Break down complex tasks into smaller, manageable subtasks
  - [x] **Review Point**

- [x] Add Documentation to plan
  - [x] Review what .md files are in /saflib
  - [x] Add any that are relevant to the implementation. Docs should be reviewed before implementation.
  - [x] Note any missing platform documentation needs. If there are gaps, add a TODO to create a doc in an appropriate /saflib/\*/docs folder after implementation.
  - [x] **Review Point**

## Implementation Phase

### Configuration Layer

- [x] Create Permissions Config
  - [x] Review [library-packages.md](/saflib/monorepo/docs/library-packages.md) for config patterns
  - [x] Create `/saflib/auth-service/config/permissions.yaml` with initial permissions - just "admin" for now
  - [x] Add config loading function to auth-service
  - [x] Update docs if needed

### Database Layer

- [x] Implement User Permissions Table
  - [x] Review [schema.md](/saflib/drizzle-sqlite3/docs/schema.md)
  - [x] Add table definitions to /saflib/auth-db/src/schema.ts
  - [x] Generate migrations
  - [x] Update schema.md if needed
  - [x] Review [queries.md](/saflib/drizzle-sqlite3/docs/queries.md) for query patterns
  - [x] Implement queries
  - [x] Write and run tests
  - [x] Verify package exports
  - [x] Update/add docs

### Session Layer

- [ ] Update Session Management
  - [x] Add a user's scopes to headers in /auth/verify, /auth/register, /auth/login in /saflib/auth-service/routes/auth.ts
  - [x] Write and run tests
  - [x] Update/add docs

### Auth Verification Layer

- [ ] Implement Scope Validation
  - [x] Review [testing.md](/saflib/node-express-dev/docs/testing.md) for test patterns
  - [x] Review [mocking.md](/saflib/node-express-dev/docs/mocking.md) for auth mocking
  - [x] Modify auth middleware to propagate scopes from header in /saflib/node-express/src/middleware/auth.ts
  - [x] Add and run tests
  - [x] Modify openapi middleware to enforce scopes from spec in /saflib/openapi-specs/src/middleware/openapi.ts
  - [x] Add and run tests
  - [x] Add middleware writing and testing doc to /saflib/node-express/docs
  - [x] Update docs if needed

### Demo Implementation

- [x] Add Admin Auto-Assignment

  - [x] Add admin permission to users who register with "admin.\*@email.com" when NODE_ENV is "TEST" in /saflib/auth-service/routes/auth.ts

- [x] Add delete all spec

  - [x] Review [update-spec.md](/saflib/openapi-specs/docs/update-spec.md) for spec patterns
  - [x] Add endpoint to delete all todos in /specs/apis/openapi.yaml
  - [x] Generate

- [ ] Add Delete All Todos Feature

  - [x] Review [queries.md](/saflib/drizzle-sqlite3/docs/queries.md) for query patterns
  - [x] Add query to auth-db
  - [x] write and run tests
  - [x] Add endpoint to auth-service
  - [x] Write and run tests
  - [x] Update docs if needed

- [ ] Add Frontend Delete All Button

  - [x] Review [queries.md](/saflib/vue-spa/docs/adding-queries.md) for query patterns
  - [x] Add vue-query functions for delete-all-todos to in /clients/requests/todos.ts
  - [x] Review [query-testing.md](/saflib/vue-spa-dev/docs/query-testing.md)
  - [x] write and run tests in /clients/requests/todos.test.ts
  - [x] Update docs if needed

  - [x] Review [component-testing.md](/saflib/vue-spa-dev/docs/component-testing.md)
  - [SKIP] Add and run test for /clients/app/views/HomePage.vue based on the doc. Just ones that test different renders are fine.
  - [x] Update docs if needed

### E2E Testing

- [x] Implement E2E Test Suite
  - [x] Create and run test for regular user flow where user cannot delete all todos
  - [x] Create and run test for admin user flow where admin can delete all todos

## Quality Checks

- [ ] Make sure everything still works
  - [ ] Run `npm run test`
  - [ ] Run `npm run lint`
  - [ ] Run `npm run format`
