# Checklist: Admin SPA and User Listing

Based on [spec.md](./spec.md) and [checklist-generation.md](../../saflib/processes/checklist-generation.md).

### Planning Phase

- [x] Set up a new branch in the monorepo
  - [x] Checkout the `main` branch
  - [x] Pull the latest changes: `git pull origin main`
  - [x] Create a new branch: `git checkout -b feat/2025-04-11-admin-spa`
- [x] Specification written in [spec.md](./spec.md)
- [x] **Review Point**: Confirm spec covers all requirements.
- [x] Update this checklist based on the final spec.
  - [x] Break down complex tasks into subtasks.
  - [x] Add file references to tasks.
- [x] **Review Point**: Confirm checklist aligns with spec.
- [x] Add Documentation to plan
  - [x] Review relevant docs from [doc-outline.md](../../saflib/processes/doc-outline.md)
  - [x] Note any missing platform documentation needs (e.g., details about admin role checks if not already documented).
  - [x] **Review Point**: Confirm documentation plan.

### Implementation Phase

Follow the implementation order: API Spec -> Database -> API Backend -> Frontend Lib -> Frontend SPA.

#### 1. API Spec Layer (`@saflib/auth-spec`)

- [x] Define the new endpoint in OpenAPI YAML format:
  - [x] Create `[auth-spec/routes/users.yaml](/saflib/auth-spec/routes/users.yaml)`
  - [x] Define `GET /auth/users` operation.
  - [x] Define request parameters (none for now).
  - [x] Define success response (200 OK) with the specified user array schema.
  - [x] Define error responses (401, 403).
  - [x] Add security requirement for `users:read` scope (referencing `auth-service` security schemes).
- [x] Update the main OpenAPI definition:
  - [x] Add a reference to `users.yaml` in `[auth-spec/openapi.yaml](/saflib/auth-spec/openapi.yaml)`.
- [x] Generate updated types:
  - [x] Run `npm run generate` in `saflib/auth-spec`.
- [x] **Review Point**: Check API spec changes and generated types.

#### 2. Database Layer (`@saflib/auth-db`)

- [x] Confirm no schema changes needed as per [spec.md](./spec.md).
  - [x] Review existing schema: `[schema.ts](/saflib/auth-db/src/schema.ts)`.
- [x] Add Database Queries:
  - [x] Review existing queries in `[users.ts](/saflib/auth-db/src/queries/users.ts)`.
  - [x] Implement `getEmailAuthByUserIds` query in `[users.ts](/saflib/auth-db/src/queries/users.ts)` to fetch email auth details for a list of user IDs (refactored from `getUsersWithEmailAuth`).
- [x] Add Tests for New Queries:
  - [x] Review DB testing documentation (e.g., `[testing-gotchas.md](../../saflib/drizzle-sqlite3-dev/docs/01-testing-gotchas.md)` if applicable).
  - [x] Add tests for `getEmailAuthByUserIds` (check fetching email auth, handling missing email auth).
- [x] Verify Database Layer:
  - [x] Run `npm run test` in `saflib/auth-db`.
- [x] **Review Point**: Confirm queries implementation, tests, and no database migrations required.

#### 3. API Layer - Backend (`@saflib/auth-service`)

- [x] Review relevant backend documentation:
  - [adding-routes.md](../../saflib/node-express/docs/02-adding-routes.md)
- [x] Implement the `GET /auth/users` route handler:
  - [x] Create `[auth-service/routes/users/list.ts](/saflib/auth-service/routes/users/list.ts)`.
  - [x] Call the `getAll` and `getEmailAuthByUserIds` database queries from `@saflib/auth-db`.
  - [x] Format the successful response according to the API spec.
  - [x] Implement admin scope check.
- [x] Register the new route:
  - [x] Import and use the new route handler in `[auth-service/routes/users/index.ts](/saflib/auth-service/routes/users/index.ts)`.
- [x] Add tests for the new route:
  - [x] Review testing documentation: [testing-middleware.md](../../saflib/node-express-dev/docs/03-test-middleware.md).
  - [x] Create tests for `users/list.ts`:
    - [x] Test successful retrieval (200 OK) for admin users.
    - [x] Test 403 Forbidden for authenticated non-admin users.
    - [x] Test 401 Unauthorized for unauthenticated requests.
    - [x] Test that the response body matches the expected format and sorting.
  - [x] Run `npm run test` in `saflib/auth-service`.
- [x] **Review Point**: Check route implementation, registration, admin checks, and tests.

#### 4. Frontend Layer - SPA (`clients/spas/admin`)

- [ ] Create the new `admin` SPA structure:
  - [ ] Create directory `[clients/spas/admin/](/clients/spas/admin/)`.
  - [ ] Structure it similarly to `[clients/spas/app](/clients/spas/app/)`.
- [ ] Set up Routing and Layout:
  - [ ] Configure `[admin/src/router.ts](/clients/spas/admin/src/router.ts)` with routes for `/` (Dashboard) and `/users` (Users page).
  - [ ] Create a basic layout in `[admin/src/App.vue](/clients/spas/admin/src/App.vue)` (e.g., top bar, left navigation).
- [ ] Implement Dashboard Page:
  - [ ] Create `[admin/src/pages/Dashboard.vue](/clients/spas/admin/src/pages/Dashboard.vue)`: Basic welcome message.
- [ ] Implement Users Page and Navigation:
  - [ ] Create `[admin/src/pages/Users.vue](/clients/spas/admin/src/pages/Users.vue)`.
  - [ ] Add links to Dashboard and Users page in the `App.vue` navigation.
- [ ] Implement TanStack Query for user list:
  - [ ] Review query documentation: [using-queries.md](../../saflib/vue-spa/docs/04-using-queries.md).
  - [ ] Create a query function/hook (e.g., in `[admin/src/requests/users.ts](/clients/spas/admin/src/requests/users.ts)`) to call `GET /auth/users`.
- [ ] Implement the `UserList` component within the SPA:
  - [ ] Review component documentation: [writing-components.md](../../saflib/vue-spa/docs/02-writing-components.md).
  - [ ] Create `[admin/src/components/UserList.vue](/clients/spas/admin/src/components/UserList.vue)`.
  - [ ] Component should accept a list of users as a prop.
  - [ ] Display users in a table or list format (showing `id`, `email`, `createdAt`, `lastLoginAt`).
  - [ ] Add basic styling.
- [ ] Integrate Query and Component in Users Page:
  - [ ] In `[admin/src/pages/Users.vue](/clients/spas/admin/src/pages/Users.vue)`:
    - [ ] Use the TanStack query hook to fetch users.
    - [ ] Display loading/error states.
    - [ ] On success, pass the user data to the `UserList` component.
- [ ] Add Tests:
  - [ ] Review testing docs:
    - [query-testing.md](../../saflib/vue-spa-dev/docs/query-testing.md)
    - [component-testing.md](../../saflib/vue-spa-dev/docs/component-testing.md)
  - [ ] Test TanStack query hook (mocking API calls).
  - [ ] Test `UserList.vue` component (e.g., rendering props correctly).
  - [ ] Test `Dashboard.vue` and `Users.vue` pages (mocking query hook/component).
  - [ ] Run `npm run test` in `clients/spas/admin`.
- [ ] **Review Point**: Check SPA structure, layout, pages, routing, API integration, component implementation, and tests.

### Testing Phase

- [ ] Test end-to-end (Manual for now, add automated later if applicable)
  - [ ] Build all packages: `npm run build` from the root.
  - [ ] Run services (e.g., using Docker Compose).
  - [ ] Log in as an admin user.
  - [ ] Navigate to the admin SPA.
  - [ ] Verify the Dashboard page loads.
  - [ ] Navigate to the Users page.
  - [ ] Verify the user list loads correctly and is sorted.
  - [ ] Log in as a non-admin user.
  - [ ] Attempt to access the Users page (verify failure/redirect/error message).
  - [ ] Attempt to call the `GET /auth/users` endpoint directly as non-admin (verify 403).
  - [ ] Attempt to call the `GET /auth/users` endpoint directly when not logged in (verify 401).
- [ ] Run integration checks:
  - [ ] Run `npm run test` from the root of the monorepo.
  - [ ] Run `npm run lint` from the root of the monorepo. Fix issues.
  - [ ] Run `npm run format` from the root of the monorepo.
- [ ] **Review Point**: Confirm end-to-end functionality and clean repo state.

### Final Documentation Review

- [ ] Review all documentation changes
  - [ ] Check if any platform docs from [doc-outline.md](../../saflib/processes/doc-outline.md) need updates (e.g., documenting the admin user check mechanism if not already covered).
  - [ ] Add product documentation/notes about the new Admin SPA and its features (if applicable).
  - [ ] Verify documentation matches implementation.
- [ ] **Review Point**: Final review of code and documentation.

### Merge

- [ ] Squash and merge the feature branch `feat/2025-04-11-admin-spa` into `main`.
- [ ] Delete the feature branch.
