# Auth Scopes Implementation Checklist

## Planning Phase

- [ ] Set up a new branch in the monorepo

  - [ ] Checkout the main branch
  - [ ] Pull the latest changes
  - [ ] Create a new branch with the current date and the name of the feature, e.g. `2025-03-28-auth-scopes`
  - [ ] **Review Point**

- [ ] Write specification

  - [ ] Make a copy of the [./feature-spec-template.md](./feature-spec-template.md) document, put it in /notes/2025-03-28-auth-scopes/spec.md
  - [ ] Fill in each section
  - [ ] **Review Point**

- [ ] Update checklist

  - [ ] Update the checkbox contents for what is necessary for this feature based on the spec
  - [ ] Break down complex tasks into smaller, manageable subtasks
  - [ ] **Review Point**

- [ ] Add Documentation to plan
  - [ ] Review what .md files are in /saflib
  - [ ] Add any that are relevant to the implementation. Docs should be reviewed before implementation.
  - [ ] Note any missing platform documentation needs. If there are gaps, add a TODO to create a doc in an appropriate /saflib/\*/docs folder after implementation.
  - [ ] **Review Point**

## Implementation Phase

### Database Layer

- [ ] Implement Permissions Table
  - [ ] Review [schema.md](/saflib/drizzle-sqlite3/docs/schema.md)
  - [ ] Add table definitions
  - [ ] Generate migrations
  - [ ] Update schema.md if needed
  - [ ] Write tests
  - [ ] Implement feature
  - [ ] Run tests
  - [ ] Verify package exports
  - [ ] Update/add docs
  - [ ] **Review Point**

### Session Layer

- [ ] Update Session Management
  - [ ] Update session types to include scopes
  - [ ] Modify session creation/validation
  - [ ] Add scope management functions
  - [ ] Write tests
  - [ ] Implement feature
  - [ ] Run tests
  - [ ] Verify package exports
  - [ ] Update/add docs
  - [ ] **Review Point**

### Auth Verification Layer

- [ ] Implement Scope Validation
  - [ ] Modify auth verification to check scopes
  - [ ] Add scope validation middleware
  - [ ] Update error handling for scope violations
  - [ ] Write tests
  - [ ] Implement feature
  - [ ] Run tests
  - [ ] Verify package exports
  - [ ] Update/add docs
  - [ ] **Review Point**

### Protocol Layer

- [ ] Update Protocol Definitions
  - [ ] Modify `envelope.proto` for scope support
  - [ ] Update related TypeScript types
  - [ ] Add scope-related RPC methods
  - [ ] Write tests
  - [ ] Implement feature
  - [ ] Run tests
  - [ ] Verify package exports
  - [ ] Update/add docs
  - [ ] **Review Point**

## Testing Phase

- [ ] Test end-to-end

  - [ ] Review [e2e-testing.md](../lib/playwright/docs/e2e-testing.md)
  - [ ] Create production docker images by running `npm run build` from `/deploy/instance`
  - [ ] Run `npm run test` in /tests/e2e and make sure existing tests still pass
  - [ ] Create test in /tests/e2e/specs for new user flow happy path
  - [ ] Run to make sure it works
  - [ ] **Review Point**

- [ ] Make sure everything still works
  - [ ] Run `npm run test`
  - [ ] Run `npm run lint`
  - [ ] Run `npm run format`
  - [ ] **Review Point**

## Final Documentation Review

- [ ] Review all documentation changes
  - [ ] Check that all platform changes are documented
  - [ ] Check that all product changes are documented
  - [ ] Verify documentation matches implementation
  - [ ] Check for any missing documentation that should be created
  - [ ] **Review Point**
