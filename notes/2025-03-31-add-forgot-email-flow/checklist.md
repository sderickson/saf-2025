# Forgot Password Flow Checklist

### Planning Phase

- [ ] Set up a new branch in the monorepo

  - [ ] Checkout the `main` branch
  - [ ] Pull the latest changes
  - [ ] Create a new branch `2025-03-31-add-forgot-email-flow`

- [ ] Write specification
  - [x] Create spec.md in `/notes/2025-03-31-add-forgot-email-flow/spec.md`
  - [x] Fill in all sections
- [ ] **Review Point**

- [ ] Update checklist
  - [x] Create this checklist
  - [x] Break down tasks based on spec
- [ ] **Review Point**

- [ ] Add Documentation to plan
  - [ ] Review relevant docs:
    - [ ] /saflib/auth-service/docs/auth-arch.md (for auth flow)
    - [ ] /saflib/vue-spa/docs/forms.md (for form components)
    - [ ] /saflib/vue-spa/docs/using-queries.md (for API integration)
    - [ ] /saflib/node-express/docs/adding-routes.md (for new endpoints)
    - [ ] /saflib/openapi-specs/docs/update-spec.md (for API spec updates)
  - [ ] Note any missing documentation needs
  - [ ] **Review Point**

### Implementation Phase

## API Spec Layer

- [ ] Update OpenAPI Specification
  - [ ] Review [update-spec.md](/saflib/openapi-specs/docs/update-spec.md)
  - [ ] Add /auth/forgot-password endpoint spec
  - [ ] Add /auth/reset-password endpoint spec
  - [ ] Generate updated types
  - [ ] **Review Point**

## Database Layer

- [ ] Implement Password Reset Token Logic
  - [ ] Review [schema.md](/saflib/drizzle-sqlite3/docs/schema.md)
  - [ ] Add token generation and validation functions
  - [ ] Add token expiration logic
  - [ ] **Review Point**

## API Layer

- [ ] Implement Forgot Password Endpoint

  - [ ] Review [adding-routes.md](/saflib/node-express/docs/adding-routes.md)
  - [ ] Add POST /auth/forgot-password endpoint
  - [ ] Implement email sending logic (logging for now)
  - [ ] Add tests using [testing-middleware.md](/saflib/node-express/docs/testing-middleware.md)
  - [ ] **Review Point**

- [ ] Implement Reset Password Endpoint
  - [ ] Review [adding-routes.md](/saflib/node-express/docs/adding-routes.md)
  - [ ] Add POST /auth/reset-password endpoint
  - [ ] Implement token validation
  - [ ] Add tests using [testing-middleware.md](/saflib/node-express/docs/testing-middleware.md)
  - [ ] **Review Point**

## Frontend Layer

- [ ] Add API Integration

  - [ ] Review [using-queries.md](/saflib/vue-spa/docs/using-queries.md)
  - [ ] Add forgot password mutation
  - [ ] Add reset password mutation
  - [ ] Add tests using [query-testing.md](/saflib/vue-spa-dev/docs/query-testing.md)
  - [ ] **Review Point**

- [ ] Update ForgotPasswordPage.vue

  - [ ] Review [forms.md](/saflib/vue-spa/docs/forms.md)
  - [ ] Implement email input form
  - [ ] Add form validation
  - [ ] Add loading states
  - [ ] Add tests using [component-testing.md](/saflib/vue-spa-dev/docs/component-testing.md)
  - [ ] **Review Point**

- [ ] Create ChangeForgottenPasswordPage.vue

  - [ ] Review [forms.md](/saflib/vue-spa/docs/forms.md)
  - [ ] Implement password reset form
  - [ ] Add password validation
  - [ ] Add loading states
  - [ ] Add tests using [component-testing.md](/saflib/vue-spa-dev/docs/component-testing.md)
  - [ ] **Review Point**

### Testing Phase

- [ ] Test end-to-end

  - [ ] Create production docker images
  - [ ] Run existing e2e tests
  - [ ] Create new e2e test for forgot password flow
  - [ ] **Review Point**

- [ ] Make sure everything still works
  - [ ] Run `npm run test`
  - [ ] Run `npm run lint`
  - [ ] Run `npm run format`
  - [ ] **Review Point**

### Final Documentation Review

- [ ] Review all documentation changes
  - [ ] Check platform changes in auth-arch.md
  - [ ] Check form patterns in forms.md
  - [ ] Check API integration in using-queries.md
  - [ ] Check route documentation in adding-routes.md
  - [ ] Check API spec updates
  - [ ] **Review Point**
