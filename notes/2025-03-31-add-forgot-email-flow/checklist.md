# Forgot Password Flow Implementation Checklist

### Planning Phase

- [ ] Set up a new branch in the monorepo
  - [ ] Checkout the `main` branch
  - [ ] Pull the latest changes
  - [ ] Create a new branch `2025-03-31-add-forgot-email-flow`
- [ ] **Review Point**: Branch setup complete

- [ ] Write specification
  - [x] Specification completed in spec.md
- [ ] **Review Point**: Specification review

- [ ] Update checklist
  - [x] Checklist created based on spec
- [ ] **Review Point**: Checklist review

- [ ] Add Documentation to plan
  - [ ] Review relevant docs from [doc-outline.md](../../saflib/processes/doc-outline.md)
  - [ ] Note any missing platform documentation needs
- [ ] **Review Point**: Documentation plan review

### Implementation Phase

## API Spec Layer

- [ ] Update OpenAPI Specification
  - [ ] Review [update-spec.md](../../saflib/openapi-specs/docs/03-updates.md)
  - [ ] Add `/auth/forgot-password` endpoint spec
  - [ ] Add `/auth/reset-password` endpoint spec
  - [ ] Generate types
- [ ] **Review Point**: API spec review

## Database Layer

- [ ] Review Schema
  - [ ] Review [schema.md](../../saflib/drizzle-sqlite3/docs/02-schema.md)
  - [ ] Verify existing fields in `emailAuth` table:
    - [ ] `forgotPasswordToken`
    - [ ] `forgotPasswordTokenExpiresAt`
- [ ] **Review Point**: Schema review

## API Layer

- [ ] Implement Forgot Password Endpoint
  - [ ] Review [adding-routes.md](../../saflib/node-express/docs/02-adding-routes.md)
  - [ ] Add `/auth/forgot-password` route
  - [ ] Implement token generation
  - [ ] Add logging
  - [ ] Add tests using [testing-middleware.md](../../saflib/node-express-dev/docs/01-test-routes.md)
- [ ] **Review Point**: Forgot password endpoint review

- [ ] Implement Reset Password Endpoint
  - [ ] Add `/auth/reset-password` route
  - [ ] Implement token validation
  - [ ] Add password update logic
  - [ ] Add logging
  - [ ] Add tests
- [ ] **Review Point**: Reset password endpoint review

## Frontend Layer

### TanStack Query Layer

- [ ] Implement API Integration
  - [ ] Review [using-queries.md](../../saflib/vue-spa/docs/04-using-queries.md)
  - [ ] Add forgot password mutation
  - [ ] Add reset password mutation
  - [ ] Add tests using [query-testing.md](../../saflib/vue-spa-dev/docs/query-testing.md)
- [ ] **Review Point**: Query implementation review

### Component Layer

- [ ] Update ForgotPasswordPage.vue
  - [ ] Review [forms.md](../../saflib/vue-spa/docs/05-forms.md)
  - [ ] Add email input with validation
  - [ ] Add submit button
  - [ ] Add loading states
  - [ ] Add success/error messages
  - [ ] Add tests using [component-testing.md](../../saflib/vue-spa-dev/docs/component-testing.md)
- [ ] **Review Point**: Forgot password page review

- [ ] Create ChangeForgottenPasswordPage.vue
  - [ ] Add temporary password input
  - [ ] Add new password input with validation
  - [ ] Add confirm password field
  - [ ] Add submit button
  - [ ] Add loading states
  - [ ] Add success/error messages
  - [ ] Add tests
- [ ] **Review Point**: Reset password page review

### Testing Phase

- [ ] Test end-to-end
  - [ ] Create production docker images
  - [ ] Run existing e2e tests
  - [ ] Create new e2e tests for forgot password flow
- [ ] **Review Point**: E2E testing review

- [ ] Make sure everything still works
  - [ ] Run `npm run test`
  - [ ] Run `npm run lint`
  - [ ] Run `npm run format`
- [ ] **Review Point**: Code quality review

### Final Documentation Review

- [ ] Review all documentation changes
  - [ ] Check platform changes in relevant docs from [doc-outline.md](../../saflib/processes/doc-outline.md)
  - [ ] Check product changes
  - [ ] Verify documentation matches implementation
- [ ] **Review Point**: Final documentation review
