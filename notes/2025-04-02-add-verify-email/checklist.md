# Email Verification Feature Checklist

### Planning Phase

- [x] Set up a new branch in the monorepo
  - [x] Checkout the `main` branch
  - [x] Pull the latest changes
  - [x] Create a new branch `2025-04-02-add-verify-email`
- [x] **Review Point**

### Implementation Phase

## API Spec Layer

- [x] Update OpenAPI Specification
  - [x] Add verification endpoints to [auth-spec/routes/auth.yaml](/saflib/auth-spec/routes/auth.yaml)
  - [x] Generate types with `npm run generate`
  - [x] **Review Point**

## API Layer

- [x] Implement Database Queries

  - [x] Add verifyEmail query to [auth-db/src/queries/email-auth.ts](/saflib/auth-db/src/queries/email-auth.ts)
  - [x] Add getByVerificationToken query to [auth-db/src/queries/email-auth.ts](/saflib/auth-db/src/queries/email-auth.ts)
  - [x] Add updateVerificationToken query to [auth-db/src/queries/email-auth.ts](/saflib/auth-db/src/queries/email-auth.ts)
  - [x] Add tests
  - [x] Run `npm run test` in the auth-db package
  - [x] **Review Point**

- [x] Implement Verification Endpoint

  - [x] Add verify-email route to [auth-service/routes/auth.ts](/saflib/auth-service/routes/auth.ts)
  - [x] Add resend-verification route to [auth-service/routes/auth.ts](/saflib/auth-service/routes/auth.ts)
  - [x] Add logging for verification links
  - [x] Add tests
  - [x] Run `npm run test` in the auth-service package
  - [x] **Review Point**

## Frontend Layer

- [x] Add API Integration

  - [x] Add verifyEmail query to [auth-vue/src/requests/auth.ts](/saflib/auth-vue/src/requests/auth.ts)
  - [x] Add resendVerification query to [auth-vue/src/requests/auth.ts](/saflib/auth-vue/src/requests/auth.ts)
  - [x] Add tests
  - [x] Run `npm run test` in the auth-vue package
  - [x] **Review Point**

- [ ] Implement VerifyEmailPage Component
  - [ ] Create [auth-vue/src/components/VerifyEmailPage.vue](/saflib/auth-vue/src/components/VerifyEmailPage.vue)
  - [ ] Add token extraction from URL
  - [ ] Add verification status display
  - [ ] Add resend verification button
  - [ ] Add link back to main app
  - [ ] Add tests
  - [ ] Run `npm run test` in the auth-vue package
  - [ ] **Review Point**

### Testing Phase

- [ ] Test end-to-end

  - [ ] Create production docker images
  - [ ] Run existing e2e tests
  - [ ] Create new e2e tests for verification flow
  - [ ] Run `npm run test` in the e2e package
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
