# Checklist: Admin SPA and User Listing

Based on [spec.md](./spec.md) and [checklist-generation.md](../../saflib/processes/checklist-generation.md).

### Planning Phase

- [ ] Set up a new branch in the monorepo
  - [ ] Checkout the `main` branch
  - [ ] Pull the latest changes: `git pull origin main`
  - [ ] Create a new branch: `git checkout -b feat/2025-04-11-admin-spa`
- [ ] Specification written in [spec.md](./spec.md)
- [ ] **Review Point**: Confirm spec covers all requirements.
- [ ] Update this checklist based on the final spec.
  - [ ] Break down complex tasks into subtasks.
  - [ ] Add file references to tasks.
- [ ] **Review Point**: Confirm checklist aligns with spec.
- [ ] Add Documentation to plan
  - [ ] Review relevant docs from [doc-outline.md](../../saflib/processes/doc-outline.md)
  - [ ] Note any missing platform documentation needs (e.g., details about admin role checks if not already documented).
  - [ ] **Review Point**: Confirm documentation plan.

### Implementation Phase

Follow the implementation order: API Spec -> Database -> API Backend -> Frontend Lib -> Frontend SPA.

#### 1. API Spec Layer (`@saflib/auth-spec`)

- [ ] Review API Spec documentation: [update-spec.md](../../saflib/openapi-specs/docs/03-updates.md)
- [ ] Define the new endpoint in OpenAPI YAML format:
  - [ ] Create `[auth-spec/routes/users.yaml](/saflib/auth-spec/routes/users.yaml)`
  - [ ] Define `GET /auth/users` operation.
  - [ ] Define request parameters (none for now).
  - [ ] Define success response (200 OK) with the specified user array schema.
  - [ ] Define error responses (401, 403).
  - [ ] Add security requirement for `admin` scope (referencing `auth-service` security schemes).
- [ ] Update the main OpenAPI definition:
  - [ ] Add a reference to `users.yaml` in `[auth-spec/openapi.yaml](/saflib/auth-spec/openapi.yaml)`.
- [ ] Generate updated types:
  - [ ] Run `npm run build` in `saflib/auth-spec`.
- [ ] **Review Point**: Check API spec changes and generated types.

#### 2. Database Layer (`@saflib/auth-db`)

- [ ] Confirm no schema changes needed as per [spec.md](./spec.md).
  - [ ] Review existing schema: `[schema.ts](/saflib/auth-db/src/schema.ts)`.
- [ ] **Review Point**: Confirm no database migrations required.

#### 3. API Layer - Backend (`@saflib/auth-service`)

- [ ] Review relevant backend documentation:
  - [adding-routes.md](../../saflib/node-express/docs/02-adding-routes.md)
  - [auth-architecture.md](../../saflib/auth-service/docs/auth-architecture.md)
- [ ] Implement the `GET /auth/users` route handler:
  - [ ] Create `[auth-service/routes/auth-users-list.ts](/saflib/auth-service/routes/auth-users-list.ts)`.
  - [ ] Add middleware to check for authentication (`isAuthenticated`).
  - [ ] Add middleware/logic to check if the authenticated user is an admin (using `ADMIN_EMAILS` environment variable). Return 403 if not.
  - [ ] Implement database query to fetch all users from the `users` table.
  - [ ] Select only required fields: `id`, `createdAt`, `lastLoginAt`, `email`.
  - [ ] Sort results by `createdAt` descending.
  - [ ] Format the response according to the API spec.
  - [ ] Add logging.
- [ ] Register the new route:
  - [ ] Import and use the new route handler in `[auth-service/routes/index.ts](/saflib/auth-service/routes/index.ts)`. Ensure it's added _after_ any necessary authentication middleware.
- [ ] Add tests for the new route:
  - [ ] Review testing documentation: [testing-middleware.md](../../saflib/node-express-dev/docs/03-test-middleware.md).
  - [ ] Create tests for `auth-users-list.ts`:
    - [ ] Test successful retrieval for admin users.
    - [ ] Test 403 Forbidden for non-admin users.
    - [ ] Test 401 Unauthorized for unauthenticated requests.
    - [ ] Test correct sorting and data format.
  - [ ] Run `npm run test` in `saflib/auth-service`.
- [ ] **Review Point**: Check route implementation, registration, admin checks, and tests.

#### 4. Frontend Layer - Library (`@saflib/admin-vue`)

- [ ] Create the new package `@saflib/admin-vue`:
  - [ ] Create directory `[saflib/admin-vue](/saflib/admin-vue/)`.
  - [ ] Create `[admin-vue/package.json](/saflib/admin-vue/package.json)` (define dependencies like Vue).
  - [ ] Create `[admin-vue/tsconfig.json](/saflib/admin-vue/tsconfig.json)`.
  - [ ] Set up basic build/dev tooling (e.g., Vite library mode).
  - [ ] Add `@saflib/admin-vue` to the root `package.json` workspaces.
- [ ] Implement the `UserList` component:
  - [ ] Review component documentation: [writing-components.md](../../saflib/vue-spa/docs/02-writing-components.md).
  - [ ] Create `[admin-vue/src/components/UserList.vue](/saflib/admin-vue/src/components/UserList.vue)`.
  - [ ] Component should accept a list of users as a prop.
  - [ ] Display users in a table or list format (showing `id`, `email`, `createdAt`, `lastLoginAt`).
  - [ ] Add basic styling.
- [ ] Export the component:
  - [ ] Create `[admin-vue/src/index.ts](/saflib/admin-vue/src/index.ts)` to export `UserList`.
- [ ] Add tests for the `UserList` component:
  - [ ] Review component testing documentation: [component-testing.md](../../saflib/vue-spa-dev/docs/component-testing.md).
  - [ ] Create tests for `UserList.vue` (e.g., rendering props correctly).
  - [ ] Run `npm run test` in `saflib/admin-vue`.
- [ ] **Review Point**: Check package structure, component implementation, export, and tests.

#### 5. Frontend Layer - SPA (`clients/spas/admin`)

- [ ] Create the new `admin` SPA structure:
  - [ ] Create directory `[clients/spas/admin/](/clients/spas/admin/)`.
  - [ ] Copy structure/config files from `[clients/spas/app/](/clients/spas/app/)` as a template:
    - `package.json` (adjust name, add `@saflib/admin-vue` dependency)
    - `vite.config.ts`
    - `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
    - `index.html` (adjust title)
    - `src/main.ts`
    - `src/App.vue`
    - `src/router.ts` (or similar routing setup)
    - Set up basic assets/styles structure if needed.
  - [ ] Add `admin` SPA to `[clients/spas/package.json](/clients/spas/package.json)` workspaces.
- [ ] Implement TanStack Query for user list:
  - [ ] Review query documentation: [using-queries.md](../../saflib/vue-spa/docs/04-using-queries.md).
  - [ ] Create a query function/hook (e.g., in `src/requests/users.ts`) to call `GET /auth/users`.
  - [ ] Add appropriate query keys.
  - [ ] Handle loading and error states.
- [ ] Implement Pages:
  - [ ] Create `[admin/src/pages/Dashboard.vue](/clients/spas/admin/src/pages/Dashboard.vue)`: Basic welcome, link to Users page.
  - [ ] Create `[admin/src/pages/Users.vue](/clients/spas/admin/src/pages/Users.vue)`:
    - [ ] Use the TanStack query hook to fetch users.
    - [ ] Display loading/error states.
    - [ ] On success, pass the user data to the `UserList` component (imported from `@saflib/admin-vue`).
- [ ] Set up Routing:
  - [ ] Configure `src/router.ts` (or equivalent) with routes for `/` (Dashboard) and `/users` (Users page).
  - [ ] Add basic navigation in `src/App.vue` (e.g., links to Dashboard and Users).
- [ ] Add Tests:
  - [ ] Review testing docs:
    - [query-testing.md](../../saflib/vue-spa-dev/docs/query-testing.md)
    - [component-testing.md](../../saflib/vue-spa-dev/docs/component-testing.md)
  - [ ] Test TanStack query hook (mocking API calls).
  - [ ] Test `Dashboard.vue` and `Users.vue` pages (mocking query hook/component).
  - [ ] Run `npm run test` in `clients/spas/admin`.
- [ ] **Review Point**: Check SPA structure, pages, routing, API integration, and tests.

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
