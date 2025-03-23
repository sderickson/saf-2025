# Auth Refactor Checklist

This checklist tracks the refactoring of auth pages into the SAF-2025 monorepo as a shared library component.

## Steps

To get started:

1. Create a folder in /notes with the name of the feature, prefixed with the date, e.g. 2025-03-23-auth
2. Make a copy of this file in that folder, call it "checklist.md"
3. Begin going through that checklist

**IMPORTANT**:

- Check off items as they are done.
- Update the plan if needed with what actually got done
- After generating or updating every file, ask for a review

### Planning Phase

- [x] Write specification
  - [x] Make a copy of the [./feature-spec-template.md](./feature-spec-template.md) document, put it in /notes/<feature-folder>/spec.md
  - [x] Fill in each section
  - [x] Ask questions to clarify any ambiguities
- [x] **Review Point**

- [x] Update checklist
  - [x] Update the checkbox contents for what is necessary for this feature based on the spec.
  - [x] Break down complex tasks into smaller, manageable subtasks.
  - [x] Note: {} indicates something to fill in or choose. ... means repeat as necessary.
- [x] **Review Point**

### Implementation Phase

#### Phase 1: Auth Spec Package

- [x] Create auth-spec package structure

  - [x] Create new directory in /saf-2025/lib/auth-spec
  - [x] Set up package.json following [creating-ts-packages.md](../lib/monorepo/docs/creating-ts-packages.md)
  - [x] **Review Point**

- [ ] Define auth schemas

  - [ ] Create schemas for login request/response
    - [ ] Review existing auth.ts to understand current types
    - [ ] Create OpenAPI schema for login request
    - [ ] Create OpenAPI schema for login response
  - [ ] Create schemas for register request/response
    - [ ] Create OpenAPI schema for register request
    - [ ] Create OpenAPI schema for register response
  - [ ] Create schemas for logout request/response
    - [ ] Create OpenAPI schema for logout request
    - [ ] Create OpenAPI schema for logout response
  - [ ] Add tests for schemas
  - [ ] **Review Point**

- [ ] Define auth paths

  - [ ] Create path definitions for /auth/login
    - [ ] Define POST method
    - [ ] Link to request/response schemas
  - [ ] Create path definitions for /auth/register
    - [ ] Define POST method
    - [ ] Link to request/response schemas
  - [ ] Create path definitions for /auth/logout
    - [ ] Define POST method
    - [ ] Link to request/response schemas
  - [ ] Add tests for paths
  - [ ] **Review Point**

- [ ] Generate TypeScript types
  - [ ] Set up type generation
  - [ ] Generate types from schemas
  - [ ] Add tests for generated types
  - [ ] **Review Point**

#### Phase 2: Auth SPA Package

- [x] Create auth-spa package structure

  - [x] Create new directory in /saf-2025/lib/auth-spa
  - [x] Set up package.json following [creating-ts-packages.md](../lib/monorepo/docs/creating-ts-packages.md)
  - [x] **Review Point**

- [ ] Migrate auth API client code

  - [ ] Copy auth.ts from clients/requests to auth-spa
  - [ ] Update imports to use auth-spec types
  - [ ] Ensure proper typing and exports
  - [ ] Add tests for the auth functions following [query-testing.md](../lib/vue-spa-dev/docs/query-testing.md)
  - [ ] **Review Point**

- [ ] Create initial auth-spa exports

  - [ ] Create index.ts to export auth functions
  - [ ] Create types.ts for shared types
  - [ ] Export routes array from router.ts
  - [ ] **Review Point**

- [ ] Migrate auth components

  - [ ] Copy LoginPage.vue from clients/auth/views
  - [ ] Copy RegisterPage.vue from clients/auth/views
  - [ ] Copy ForgotPasswordPage.vue from clients/auth/views
  - [ ] Copy LogoutPage.vue from clients/auth/views
  - [ ] Update component imports to use new auth-spa package
  - [ ] Add tests for components following [component-testing.md](../lib/vue-spa-dev/docs/component-testing.md)
  - [ ] **Review Point**

- [ ] Update existing auth client

  - [ ] Update imports to use new auth-spa package
  - [ ] Test that everything still works
  - [ ] **Review Point**

- [ ] Clean up old code
  - [ ] Remove old auth.ts from clients/requests
  - [ ] Remove old components from clients/auth/views
  - [ ] **Review Point**

### Testing Phase

- [ ] Test end-to-end

  - [ ] Create production docker images by running `npm run build` from `/deploy/instance`
  - [ ] Run `npm run test` in /tests/e2e and make sure existing tests still pass
  - [ ] Create test in /tests/e2e/specs for auth flow
  - [ ] Run to make sure it works
  - [ ] **Review Point**

- [ ] Make sure everything still works
  - [ ] Run `npm run test`
  - [ ] Run `npm run test:coverage` and fill in any major gaps
  - [ ] Run `npm run lint`
  - [ ] Run `npm run format`
  - [ ] **Review Point**
