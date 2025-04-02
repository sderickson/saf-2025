# Email Verification Feature Checklist

### Planning Phase

- [ ] Set up a new branch in the monorepo
  - [ ] Checkout the `main` branch
  - [ ] Pull the latest changes
  - [ ] Create a new branch `2025-04-02-add-verify-email`
- [ ] **Review Point**

### Implementation Phase

## API Spec Layer

- [ ] Update OpenAPI Specification
  - [ ] Review [update-spec.md](../openapi-specs/docs/03-updates.md)
  - [ ] Create new schema file [auth-spec/schemas/email-verification.yaml](/saflib/auth-spec/schemas/email-verification.yaml)
  - [ ] Add verification endpoints to [auth-spec/routes/auth.yaml](/saflib/auth-spec/routes/auth.yaml)
  - [ ] Generate types with `npm run generate`
  - [ ] **Review Point**

## API Layer

- [ ] Implement Verification Endpoint
  - [ ] Review [adding-routes.md](../node-express/docs/02-adding-routes.md)
  - [ ] Add verify-email route to [auth-service/routes/auth.ts](/saflib/auth-service/routes/auth.ts)
  - [ ] Add resend-verification route to [auth-service/routes/auth.ts](/saflib/auth-service/routes/auth.ts)
  - [ ] Add logging for verification links
  - [ ] Add tests using [test-routes.md](../../saflib/node-express-dev/docs/01-test-routes.md)
  - [ ] Run `npm run test` in the auth-service package to verify endpoints
  - [ ] **Review Point**

## Frontend Layer

- [ ] Add API Integration

  - [ ] Review [using-queries.md](../vue-spa/docs/04-using-queries.md)
  - [ ] Add verifyEmail query to [auth-vue/src/requests/auth.ts](/saflib/auth-vue/src/requests/auth.ts)
  - [ ] Add resendVerification query to [auth-vue/src/requests/auth.ts](/saflib/auth-vue/src/requests/auth.ts)
  - [ ] Add tests using [query-testing.md](../vue-spa-dev/docs/query-testing.md)
  - [ ] Run `npm run test` in the auth-vue package to verify query implementation
  - [ ] **Review Point**

- [ ] Implement VerifyEmailPage Component
  - [ ] Review [forms.md](../vue-spa/docs/05-forms.md)
  - [ ] Create [auth-vue/src/components/VerifyEmailPage.vue](/saflib/auth-vue/src/components/VerifyEmailPage.vue)
  - [ ] Add token extraction from URL
  - [ ] Add verification status display
  - [ ] Add resend verification button
  - [ ] Add link back to main app
  - [ ] Add tests using [component-testing.md](../vue-spa-dev/docs/component-testing.md)
  - [ ] Run `npm run test` in the auth-vue package to verify component
  - [ ] **Review Point**

### Testing Phase

- [ ] Test end-to-end

  - [ ] Create production docker images
  - [ ] Run existing e2e tests
  - [ ] Create new e2e tests for verification flow
  - [ ] Run `npm run test` in the e2e package to verify e2e changes
  - [ ] **Review Point**

- [ ] Make sure everything still works
  - [ ] Run `npm run test` from the root of the monorepo
  - [ ] Run `npm run lint` from the root of the monorepo
  - [ ] Run `npm run format` from the root of the monorepo
  - [ ] **Review Point**

### Final Documentation Review

- [ ] Review all documentation changes
  - [ ] Check platform changes in relevant docs from [doc-outline.md](./doc-outline.md)
  - [ ] Check product changes
  - [ ] Verify documentation matches implementation
  - [ ] Run `npm run test` from the root of the monorepo
  - [ ] **Review Point**
