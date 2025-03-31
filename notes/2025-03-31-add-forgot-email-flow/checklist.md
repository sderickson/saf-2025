# Forgot Password Flow Implementation Checklist

### Planning Phase

- [x] Set up a new branch in the monorepo
  - [x] Checkout the `main` branch
  - [x] Pull the latest changes
  - [x] Create a new branch `2025-03-31-add-forgot-email-flow`
- [x] **Review Point**: Branch setup complete

- [x] Write specification
  - [x] Specification completed in spec.md
- [x] **Review Point**: Specification review

- [x] Update checklist
  - [x] Checklist created based on spec
- [x] **Review Point**: Checklist review

- [x] Add Documentation to plan
  - [x] Review relevant docs from [doc-outline.md](/saflib/processes/doc-outline.md)
  - [x] Note any missing platform documentation needs
- [x] **Review Point**: Documentation plan review

### Implementation Phase

## API Spec Layer

- [x] Update OpenAPI Specification
  - [x] Review [update-spec.md](/saflib/openapi-specs/docs/03-updates.md)
  - [x] Add `/auth/forgot-password` endpoint spec to [auth-spec/openapi.yaml](/saflib/auth-spec/openapi.yaml)
  - [x] Add `/auth/reset-password` endpoint spec to [auth-spec/openapi.yaml](/saflib/auth-spec/openapi.yaml)
  - [x] Generate types
  - [x] Run tests to verify type generation
- [x] **Review Point**: API spec review

## Database Layer

- [x] Review Schema
  - [x] Review [schema.md](/saflib/drizzle-sqlite3/docs/02-schema.md)
  - [x] Verify existing fields in [auth-db/src/schema.ts](/saflib/auth-db/src/schema.ts):
    - [x] `forgotPasswordToken`
    - [x] `forgotPasswordTokenExpiresAt`
  - [x] Run tests to verify schema
- [x] **Review Point**: Schema review

## API Layer

- [x] Implement Forgot Password Endpoint
  - [x] Review [adding-routes.md](/saflib/node-express/docs/02-adding-routes.md)
  - [x] Add `/auth/forgot-password` route to [auth-service/routes/auth.ts](/saflib/auth-service/routes/auth.ts)
  - [x] Implement token generation
  - [x] Add logging
  - [x] Add tests using [testing-middleware.md](/saflib/node-express-dev/docs/01-test-routes.md)
  - [x] Run tests to verify endpoint
- [x] **Review Point**: Forgot password endpoint review

- [x] Implement Reset Password Endpoint
  - [x] Add `/auth/reset-password` route to [auth-service/routes/auth.ts](/saflib/auth-service/routes/auth.ts)
  - [x] Implement token validation
  - [x] Add password update logic
  - [x] Add tests using [this doc](/saflib/node-express-dev/docs/01-test-routes.md)
  - [x] Run tests to verify endpoint
- [x] **Review Point**: Reset password endpoint review

## Frontend Layer

### TanStack Query Layer

- [x] Implement API Integration
  - [x] Review [using-queries.md](/saflib/vue-spa/docs/04-using-queries.md)
  - [x] Add forgot password mutation to [auth-vue/src/requests/auth.ts](/saflib/auth-vue/src/requests/auth.ts)
  - [x] Add reset password mutation to [auth-vue/src/requests/auth.ts](/saflib/auth-vue/src/requests/auth.ts)
  - [x] Add tests using [query-testing.md](/saflib/vue-spa-dev/docs/query-testing.md)
  - [x] Run tests to verify mutations
- [x] **Review Point**: Query implementation review

### Component Layer

- [ ] Update ForgotPasswordPage.vue
  - [ ] Review [forms.md](/saflib/vue-spa/docs/05-forms.md)
  - [ ] Update [auth-vue/src/components/ForgotPasswordPage.vue](/saflib/auth-vue/src/components/ForgotPasswordPage.vue)
  - [ ] Add email input with validation
  - [ ] Add submit button
  - [ ] Add loading states
  - [ ] Add success/error messages
  - [ ] Add tests using [component-testing.md](/saflib/vue-spa-dev/docs/component-testing.md)
  - [ ] Run tests to verify component
- [ ] **Review Point**: Forgot password page review

- [ ] Create ChangeForgottenPasswordPage.vue
  - [ ] Add temporary password input
  - [ ] Add new password input with validation
  - [ ] Add confirm password field
  - [ ] Add submit button
  - [ ] Add loading states
  - [ ] Add success/error messages
  - [ ] Add tests
  - [ ] Run tests to verify component
- [ ] **Review Point**: Reset password page review

### Testing Phase

- [ ] Test end-to-end
  - [ ] Create production docker images
  - [ ] Run existing e2e tests
  - [ ] Create new e2e tests for forgot password flow
  - [ ] Run all tests to verify e2e changes
- [ ] **Review Point**: E2E testing review

- [ ] Make sure everything still works
  - [ ] Run `npm run test`
  - [ ] Run `npm run lint`
  - [ ] Run `npm run format`
- [ ] **Review Point**: Code quality review

### Final Documentation Review

- [ ] Review all documentation changes
  - [ ] Check platform changes in relevant docs from [doc-outline.md](/saflib/processes/doc-outline.md)
  - [ ] Check product changes
  - [ ] Verify documentation matches implementation
  - [ ] Run tests one final time
- [ ] **Review Point**: Final documentation review
