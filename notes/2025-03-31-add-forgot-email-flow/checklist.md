# Writing Feature Checklists

### Planning Phase

- [x] Set up a new branch in the monorepo

  - [x] Checkout the `main` branch
  - [x] Pull the latest changes
  - [x] Create a new branch with the current date and the name of the feature, e.g. `2025-03-31-add-forgot-email-flow`

- [x] Write specification
  - [x] Make a copy of the [./feature-spec-template.md](./feature-spec-template.md) document, put it in `/notes/<branch-name>/spec.md`
  - [x] Fill in each section
- [x] **Review Point**

- [ ] Update checklist
  - [x] Update the checkbox contents for what is necessary for this feature based on the spec
  - [x] Break down complex tasks into smaller, manageable subtasks
- [ ] **Review Point**

- [ ] Add Documentation to plan
  - [ ] Review what `.md` files are in /saflib
  - [ ] Add any that are relevant to the implementation. Docs should be reviewed before implementation.
  - [ ] Note any missing platform documentation needs. If there are gaps, add a TODO to create a doc in an appropraite `/saflib/*/docs` folder after implementation. Even for existing docs, have a checkbox for making any necessary updates if guidance was required.
  - [ ] **Review Point**

### Implementation Phase

## Database Layer

- [ ] Verify Schema Support
  - [ ] Review existing schema in auth-db/src/schema.ts
  - [ ] Verify forgotPasswordToken and forgotPasswordTokenExpiresAt fields exist
  - [ ] **Review Point**

## API Layer

- [ ] Implement Forgot Password Endpoint

  - [ ] Write tests for /auth/forgot-password endpoint
  - [ ] Implement endpoint with secure response handling
  - [ ] Add logging for temporary password generation
  - [ ] Run tests
  - [ ] **Review Point**

- [ ] Implement Reset Password Endpoint
  - [ ] Write tests for /auth/reset-password endpoint
  - [ ] Implement endpoint with token validation
  - [ ] Add password update logic
  - [ ] Run tests
  - [ ] **Review Point**

## Frontend Layer

- [ ] Update ForgotPasswordPage.vue

  - [ ] Write tests for component
  - [ ] Update form validation
  - [ ] Add loading state
  - [ ] Add success/error message handling
  - [ ] Run tests
  - [ ] **Review Point**

- [ ] Create ChangeForgottenPasswordPage.vue

  - [ ] Write tests for component
  - [ ] Implement form with validation
  - [ ] Add loading state
  - [ ] Add success/error message handling
  - [ ] Run tests
  - [ ] **Review Point**

- [ ] Update Router Configuration
  - [ ] Add route for new page
  - [ ] Add navigation guards if needed
  - [ ] **Review Point**

### Testing Phase

- [ ] Test end-to-end

  - [ ] Create production docker images by running `npm run build` from `/deploy/instance`
  - [ ] Run `npm run test` in /tests/e2e and make sure existing tests still pass
  - [ ] Create test in /tests/e2e/specs for forgot password flow happy path
  - [ ] Run to make sure it works
  - [ ] **Review Point**

- [ ] Make sure everything still works
  - [ ] Run `npm run test`
  - [ ] Run `npm run lint`
  - [ ] Run `npm run format`
  - [ ] **Review Point**

### Final Documentation Review

- [ ] Review all documentation changes
  - [ ] Check that all platform changes are documented
  - [ ] Check that all product changes are documented
  - [ ] Verify documentation matches implementation
  - [ ] Check for any missing documentation that should be created
  - [ ] **Review Point**
