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
  - [x] Create routes/auth.yaml
  - [x] Create schemas/error.yaml
  - [x] Create openapi.yaml
  - [x] Create package.json
- [x] Define OpenAPI schemas and paths
  - [x] Define RegisterRequest schema
  - [x] Define LoginRequest schema
  - [x] Define UserResponse schema
  - [x] Define error schema
  - [x] Define register path
  - [x] Define login path
  - [x] Define logout path
  - [x] Define verify path
- [ ] Generate TypeScript types
  - [ ] Add generate scripts to package.json
  - [ ] Run generate to create types
  - [ ] Verify generated types

#### Phase 2: Request Logic Migration

- [ ] Create auth-spa package structure
  - [ ] Create src/requests directory
  - [ ] Create src/types.ts
  - [ ] Create src/routes.ts
  - [ ] Create src/index.ts
  - [ ] Create package.json
- [ ] Copy auth request functions
  - [ ] Copy useLogin function
  - [ ] Copy useLogout function
  - [ ] Copy useRegister function
- [ ] Update imports to use auth-spec types
- [ ] Add tests for the functions following [query-testing.md](../lib/vue-spa-dev/docs/query-testing.md)

#### Phase 3: Component Migration

- [ ] Copy Vue components
  - [ ] Copy LoginPage.vue
  - [ ] Copy RegisterPage.vue
  - [ ] Copy ForgotPasswordPage.vue
  - [ ] Copy LogoutPage.vue
- [ ] Update imports to use new auth request functions
- [ ] Add component tests following [component-testing.md](../lib/vue-spa-dev/docs/component-testing.md)

#### Phase 4: Integration

- [ ] Update existing auth client
  - [ ] Update imports to use new library
  - [ ] Update router configuration
- [ ] Test the integration
- [ ] Remove old code
  - [ ] Remove old auth request functions
  - [ ] Remove old components
  - [ ] Remove old types

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
