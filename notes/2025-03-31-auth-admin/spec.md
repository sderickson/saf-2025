# Admin SPA Feature Specification

## Overview

The Admin SPA is a new Single Page Application that provides an administrative interface for managing users and their authorization scopes in the SAF-2025 framework. This interface will allow administrators to view, search, and manage user accounts and their associated permissions.

## User Stories

- As an administrator, I want to view a list of all users so that I can monitor system usage
- As an administrator, I want to search for specific users so that I can quickly find and manage their accounts
- As an administrator, I want to view detailed information about a specific user so that I can understand their account status and permissions
- As an administrator, I want to manage user scopes so that I can control their access to different parts of the system
- As an administrator, I want to update a user's scopes so that I can grant or revoke specific permissions

## Technical Requirements

### Database Schema Updates

No direct database schema updates are required as this SPA will interact with the existing auth database through the auth service API.

### API Endpoints

1. GET /users

   - Purpose: List and search users
   - Request parameters:
     - query (optional): Search string for filtering users
     - page (optional): Page number for pagination
     - limit (optional): Number of items per page
   - Response: List of users with pagination metadata
   - Authorization requirements: Admin scope required

2. GET /users/:id

   - Purpose: Get detailed information about a specific user
   - Request parameters: id (path parameter)
   - Response: Detailed user information including current scopes
   - Authorization requirements: Admin scope required

3. PUT /users/:id/scopes
   - Purpose: Update a user's authorization scopes
   - Request parameters: id (path parameter)
   - Request body: Array of scope strings
   - Response: Updated user information
   - Authorization requirements: Admin scope required

### Frontend SPA

A new SPA will be created following the Vue SPA template in `lib/vue-spa/docs/add-spa.md`. The SPA will be named `admin` and will be a standalone application for user management and other admin functions.

### Frontend Pages

1. Admin Router

   - Purpose: Chrome for all admin pages
   - Features:
     - Navigation to admin functions

2. Admin Dashboard

   - Purpose: Display a welcome message and navigation to other admin functions
   - Features:
     - Welcome message
     - Will add widgets later

3. User List Page

   - Purpose: Display and search users
   - Features:
     - Search input for filtering users
     - Paginated table of users
     - Quick actions (view details, edit scopes)
     - Sort and filter capabilities
   - User interactions:
     - Search by username, email, or ID
     - Click user to view details
     - Click edit to modify scopes
   - State management:
     - Search query
     - Pagination state
     - Sort/filter preferences

4. User Detail Page
   - Purpose: View and manage individual user details
   - Features:
     - User information display
     - Current scopes list
     - Scope management interface
   - User interactions:
     - Edit scopes
     - View user details
     - Navigate back to list
   - State management:
     - User data
     - Scope changes
     - Form state

## Implementation Considerations

- Security considerations:
  - All API endpoints must require admin scope
- Dependencies:
  - Requires auth-service-library
  - Requires auth-scopes implementation
  - Uses Vue SPA framework
- Packages affected:
  - Pages should go into the `saflib/auth-vue`
  - API Spec changes go in `saflib/auth-spec`
  - Backend changes go in `saflib/auth-service`

## Future Enhancements / Out of Scope

- Bulk user operations
- Audit log viewing
- Activity history

## Questions and Clarifications

- Should we implement real-time updates for user changes?
  - They would be realtime? In that changes to scopes will immediately affect user requests.
  - The more immediate problem is we fetch scopes for each request, which not efficient.
  - When that problem is solved with caching, then we can think about real-time updates.
- What is the maximum number of scopes a user can have?
  - indeterminate
- Should we implement scope templates/presets?
  - No
- How should we handle failed scope updates?
  - Yes, you know what, as part of this work let's create a reusable component which takes an array of (reactive) error objects and displays them until dismissed. Please add that to the checklist, and add it to `vue-spa`.
