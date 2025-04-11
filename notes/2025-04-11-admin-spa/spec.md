# Feature Specification: Admin SPA and User Listing

## Overview

This feature introduces a new administration interface for the SAF-2025 platform. It involves creating a new TypeScript package `@saflib/admin-vue` to house reusable admin-focused Vue components, starting with a `UserList` component. A new API endpoint `/auth/users` will be added to the `@saflib/auth-service` to provide user data. This endpoint's specification will be defined in `@saflib/auth-spec`. Finally, a new Single Page Application (SPA) named `admin` will be created under `clients/spas/` to host the admin dashboard and user management pages, utilizing the new `@saflib/admin-vue` package. Access to the user list endpoint and the admin SPA will be restricted to users with administrative privileges.

## Files to Modify

List only the files or folders that will definitely need changes. Organize them by layer:

### API Specification

- **New File:** [auth-spec/routes/users.yaml](/saflib/auth-spec/routes/users.yaml) - Define the types for the new `/auth/users` endpoint. Set "security" to require the "admin" scope like in todos.yaml it is done for "deleteAllTodos".
- [auth-spec/openapi.yaml](/saflib/auth-spec/openapi.yaml) - Add the specification for the `GET /auth/users` endpoint.

### Backend (@saflib/auth-service)

- **New File:** [auth-service/routes/auth-users-list.ts](/saflib/auth-service/routes/auth-users-list.ts) - Implement the route handler for `GET /auth/users`.
- [auth-service/routes/index.ts](/saflib/auth-service/routes/index.ts) - Register the new users route.

### Frontend (@saflib/admin-vue)

- **New Package:** `[@saflib/admin-vue](/saflib/admin-vue/)`
- **New File:** `[admin-vue/src/components/UserList.vue](/saflib/admin-vue/src/components/UserList.vue)` - Create the Vue component to display the list of users.
- **New File:** `[admin-vue/src/index.ts](/saflib/admin-vue/src/index.ts)` - Export the `UserList` component.
- **New File:** `[admin-vue/package.json](/saflib/admin-vue/package.json)` - Package manifest for the new `@saflib/admin-vue` package.

### Frontend (clients/spas/admin)

- **New SPA:** `[clients/spas/admin/](/clients/spas/admin/)` - structure it like /clients/spas/app
- **New File:** `[admin/src/pages/Dashboard.vue](/clients/spas/admin/src/pages/Dashboard.vue)` - Create the main dashboard page.
- **New File:** `[admin/src/pages/Users.vue](/clients/spas/admin/src/pages/Users.vue)` - Create the page that will use the `UserList` component.

## User Stories

- As an Administrator, I want to view a list of all registered users so that I can monitor and manage user accounts.
- As an Administrator, I want the user list to be sorted by creation date (newest first) so that I can easily identify recently registered users.
- As an Administrator, I want access to the user list restricted to only admin users so that user data is protected.

## Technical Requirements

### Database Schema Updates

- No schema changes are required for this initial feature. The existing `users` table in `[schema.ts](/saflib/auth-db/src/schema.ts)` contains the necessary information (id, createdAt, lastLoginAt, email). The backend service will use the existing `getAll` query to fetch user data and the new `getEmailAuthByUserIds` query if needed for related email authentication details.

### API Endpoints

1.  **GET /auth/users**
    - Purpose: Retrieve a list of all users for administrative purposes.
    - Request parameters: None initially (consider pagination later).
    - Request body: None.
    - Response: `200 OK`
      - Body: `Array<{ id: number; createdAt: date; lastLoginAt: date | null; email: string; }>` - An array of user objects, sorted by `createdAt` descending.
    - Error responses:
      - `401 Unauthorized`: If the requestor is not logged in.
      - `403 Forbidden`: If the logged-in user does not have administrative privileges.
    - Authorization requirements: Requires the user to be authenticated and possess an 'admin' role or permission.

### Frontend SPA

- A new SPA named `admin` will be created within the `[clients/spas/](/clients/spas/)` directory. This SPA will serve as the primary interface for administrative tasks.

### Frontend Pages

1.  **Admin Dashboard (`/`)**
    - Purpose: Serve as the landing page for the admin section.
    - Key features: Basic welcome message, navigation links (initially just to Users).
    - User interactions: Navigate to the Users page.
2.  **Users Page (`/users`)**
    - Purpose: Display the list of registered users.
    - Key features: Integrates the `UserList` component from `@saflib/admin-vue`, fetches user data from the `GET /auth/users` endpoint.
    - User interactions: View the list of users.

## Implementation Considerations

- **Security:** The `GET /auth/users` endpoint must be rigorously protected to ensure only authorized administrators can access it. Implement robust permission checks in the `auth-service`. The admin SPA itself should also enforce authentication and authorization checks.
- **Performance:** For large numbers of users, the initial implementation retrieving all users might become slow. Pagination should be considered as a follow-up enhancement.
- **UI/UX:** The initial version will be basic. Plan for future improvements to user experience, such as search, filtering, and sorting controls on the Users page.
- **Error Handling:** Implement proper error handling in the frontend SPA to inform the admin if user data fails to load.
- **Package Management:** Ensure the new `@saflib/admin-vue` package is correctly set up as a workspace dependency for the `admin` SPA.

## Future Enhancements / Out of Scope

- User detail view page.
- Ability to create, edit, or delete users from the admin interface.
- Implementing pagination, searching, and filtering for the user list endpoint and UI.
- Adding more administrative features (e.g., managing cron jobs, viewing system logs).
- Role-based access control refinements within the admin section.

## Questions and Clarifications

- What specific mechanism (e.g., a role, a specific permission string in `userPermissions` table) should designate a user as an 'admin'? (Assume a simple 'admin' permission string in `userPermissions` for now).
  - The auth-service already takes in an "ADMIN_EMAILS" environment variable, which is used to determine if a user is an admin.

## File Linking Guidelines

When referencing files in the specification:

1. Only list files that will definitely need changes
2. Use absolute paths from the repository root, e.g. `/saflib/auth-service/routes/auth.ts`
3. Use markdown links with descriptive text, e.g. `[auth.ts](/saflib/auth-service/routes/auth.ts)`
4. Group files by architectural layer (API Spec, Backend, Frontend)
5. Include any new files that need to be created
6. Note any files that need to be deleted (None for this feature)
