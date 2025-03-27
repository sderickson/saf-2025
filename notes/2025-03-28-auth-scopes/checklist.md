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

- [ ] Implement User Permissions Table
  - [ ] Review [schema.md](/saflib/drizzle-sqlite3/docs/schema.md)
  - [ ] Add table definitions
  - [ ] Generate migrations
  - [ ] Update schema.md if needed
  - [ ] Review [queries.md](/saflib/drizzle-sqlite3/docs/queries.md) for query patterns
  - [ ] Implement queries
  - [ ] Write and run tests
  - [ ] Verify package exports
  - [ ] Update/add docs

### Session Layer

- [ ] Update Session Management
  - [ ] Add a user's scopes to headers in /auth/verify, /auth/register, /auth/login in /saflib/auth-service/routes/auth.ts
  - [ ] Write and run tests
  - [ ] Update/add docs

### Auth Verification Layer

- [ ] Implement Scope Validation
  - [ ] Review [testing.md](/saflib/node-express-dev/docs/testing.md) for test patterns
  - [ ] Review [mocking.md](/saflib/node-express-dev/docs/mocking.md) for auth mocking
  - [ ] Modify auth middleware to propagate scopes from header in /saflib/node-express/src/middleware/auth.ts
  - [ ] Add and run tests
  - [ ] Modify openapi middleware to enforce scopes from spec in /saflib/openapi-specs/src/middleware/openapi.ts
  - [ ] Add and run tests
  - [ ] Add middleware writing and testing doc to /saflib/node-express/docs
  - [ ] Update docs if needed

### Demo Implementation

- [ ] Add Admin Auto-Assignment

  - [ ] Add admin permission to users who register with "admin.\*@email.com" when NODE_ENV is "TEST" in /saflib/auth-service/routes/auth.ts

- [ ] Add delete all spec

  - [ ] Review [update-spec.md](/saflib/openapi-specs/docs/update-spec.md) for spec patterns
  - [ ] Add endpoint to delete all todos in /specs/apis/openapi.yaml
  - [ ] Generate
  - [ ] Update docs if needed

- [ ] Add Delete All Todos Feature

  - [ ] Review [queries.md](/saflib/drizzle-sqlite3/docs/queries.md) for query patterns
  - [ ] Add query to auth-db
  - [ ] write and run tests
  - [ ] Add endpoint to auth-service
  - [ ] Write and run tests
  - [ ] Update docs if needed

- [ ] Add Frontend Delete All Button

  - [ ] Review [queries.md](/saflib/vue-spa/docs/adding-queries.md) for query patterns
  - [ ] Add vue-query functions for delete-all-todos to auth-vue
  - [ ] write and run tests
  - [ ] Update docs if needed

  - [ ] Review [component-testing.md](/saflib/vue-spa-dev/docs/component-testing.md)
  - [ ] Add and run test for HomePage.vue
  - [ ] Update docs if needed

  - [ ] Review [writing-components.md](/saflib/vue-spa/docs/writing-components.md)
  - [ ] Review [using-queries.md](/saflib/vue-spa/docs/using-queries.md)
  - [ ] Add button to HomePage.vue
  - [ ] Have the button call the query function
  - [ ] Update test for HomePage.vue
  - [ ] Update docs if needed

### E2E Testing

- [ ] Implement E2E Test Suite
  - [ ] Create and run test for regular user flow where user cannot delete all todos
  - [ ] Create and run test for admin user flow where admin can delete all todos
  - [ ] Add /saflib/playwright/docs/e2e-testing.md and fill out based on how it went writing these tests

## Quality Checks

- [ ] Make sure everything still works
  - [ ] Run `npm run test`
  - [ ] Run `npm run lint`
  - [ ] Run `npm run format`
