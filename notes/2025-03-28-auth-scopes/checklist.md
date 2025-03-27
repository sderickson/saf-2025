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

- [ ] Add Documentation to plan
  - [ ] Review what .md files are in /saflib
  - [ ] Add any that are relevant to the implementation. Docs should be reviewed before implementation.
  - [ ] Note any missing platform documentation needs. If there are gaps, add a TODO to create a doc in an appropriate /saflib/\*/docs folder after implementation.
  - [ ] **Review Point**

## Implementation Phase

### Configuration Layer

- [ ] Create Permissions Config
  - [ ] Create `config/permissions.yaml` with initial permissions
  - [ ] Add TypeScript types for permissions config
  - [ ] Add config loading function to auth-service
  - [ ] Write tests
  - [ ] Implement feature
  - [ ] Run tests
  - [ ] Verify package exports
  - [ ] Update/add docs
  - [ ] **Review Point**

### Database Layer

- [ ] Implement User Permissions Table
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

### Demo Implementation

- [ ] Add Admin Auto-Assignment

  - [ ] Add admin email pattern check in auth-service
  - [ ] Add admin permission assignment on user creation when node is running in test mode
  - [ ] **Review Point**

- [ ] Add Delete All Todos Feature

  - [ ] Add spec to auth-spec
  - [ ] generate
  - [ ] Add query to auth-db
  - [ ] write and run tests
  - [ ] Add endpoint to auth-service
  - [ ] Write and run tests

- [ ] Add Frontend Delete All Button
  - [ ] Add vue-query functions for delete-all-todos to auth-vue
  - [ ] write and run tests
  - [ ] Add button to HomePage.vue
  - [ ] Write and run component test

### E2E Testing

- [ ] Implement E2E Test Suite
  - [ ] Create test for regular user flow
  - [ ] Create test for admin user flow
  - [ ] Test permission enforcement
  - [ ] Run tests
  - [ ] **Review Point**

## Quality Checks

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
