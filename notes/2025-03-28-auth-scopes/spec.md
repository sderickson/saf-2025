# Auth Scopes Feature Specification

## Overview

The Auth Scopes feature adds scope-based authorization to the SAF-2025 framework's authentication system. This enhancement allows for fine-grained control over user permissions and access rights across different parts of the system. The feature builds upon the existing authentication infrastructure by adding a permissions configuration file, updating user sessions to include scopes, and implementing scope validation middleware.

## User Stories

- As a system administrator, I want to assign specific scopes to users so that I can control their access to different parts of the system.
- As a developer, I want to check user scopes in my API endpoints so that I can implement fine-grained access control.
- As a user, I want to see what permissions I have so that I understand what actions I can perform.
- As a service, I want to validate user scopes so that I can enforce access control consistently across the system.

## Technical Requirements

### Configuration Updates

- File: `config/permissions.yaml`
  - Structure:
    ```yaml
    permissions:
      - name: "admin"
        description: "Full system access"
      - name: "read"
        description: "Read-only access"
      # ... more permissions
    ```

### Database Schema Updates

- Table: `user_permissions`
  - Fields:
    - `user_id`: integer (foreign key to users)
    - `permission_id`: integer (matches id in permissions.yaml)
    - `created_at`: timestamp
    - `granted_by`: integer (foreign key to users)
  - Relationships:
    - Belongs to users
    - References permissions from config file

### API Endpoints

1. GET /auth/permissions

   - Purpose: List all available permissions from config file
   - Response: Array of permission objects
   - Authorization: Requires 'admin' scope

2. GET /auth/users/:userId/permissions

   - Purpose: Get user's assigned permissions
   - Response: Array of permission objects
   - Authorization: Requires 'admin' scope or own user ID

3. PUT /auth/users/:userId/permissions
   - Purpose: Update user's assigned permissions
   - Request body: Array of permission IDs
   - Response: Updated user permissions
   - Authorization: Requires 'admin' scope

### Protocol Updates

1. Update `envelope.proto`:
   - Add scope field to authentication messages
   - Add permission-related RPC methods
   - Update error types to include scope violations

### Middleware Updates

1. Scope Validation Middleware:
   - Purpose: Validate required scopes for routes
   - Configuration: Route-specific scope requirements
   - Error handling: 403 Forbidden for scope violations

## Implementation Considerations

- Performance:

  - Load permissions config file at startup
  - Cache permissions in memory
  - Optimize permission checks for high-traffic routes

- Security:

  - Ensure scope validation is performed at all security boundaries
  - Implement proper error handling for scope violations
  - Log all permission changes for audit purposes

- Compatibility:
  - Maintain backward compatibility with existing auth system
  - Support both API and RPC interfaces

## Future Enhancements / Out of Scope

- Role-based access control (RBAC) system
- Dynamic scope assignment based on user attributes
- Permission inheritance and hierarchy
- Permission groups and templates
- Real-time permission updates

## Questions and Clarifications

- Should we implement permission caching? If so, what's the cache invalidation strategy?
  - No, we'll load permissions from config file at startup and keep in memory
- How should we handle permission changes during active sessions?
  - No, permissions are static during session lifetime
- What's the migration strategy for existing users?
  - No migration needed, there are no existing users
- Should we implement permission inheritance?
  - No, keep permissions flat and simple
- How do we handle permission conflicts between different services?
  - No, permissions are service-specific
