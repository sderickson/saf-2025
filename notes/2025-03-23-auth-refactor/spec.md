# Auth Refactor Specification

## Overview

This specification outlines the refactoring of auth-related code into a shared library component within the SAF-2025 monorepo. The goal is to make auth functionality reusable across different products while maintaining a simple and flexible interface.

## Goals

1. Create a shared auth library that can be used across different products
2. Keep the interface simple and focused on core functionality
3. Maintain backward compatibility with existing auth implementations
4. Enable products to integrate auth routes as children of their own router configurations
5. Create a dedicated package for auth-related API specifications

## Non-Goals

1. Creating a complex auth framework with many configuration options
2. Implementing new auth features or changing existing auth behavior
3. Creating a standalone auth application

## Technical Design

### Package Structure

We will create two new packages in the monorepo:

1. `@saf-2025/auth-spec` - Contains auth-related API specifications
2. `@saf-2025/auth-spa` - Contains auth-related frontend components and utilities

#### Auth Spec Package

The auth spec package will be created as `@saf-2025/auth-spec` with the following structure:

```
lib/auth-spec/
├── src/
│   ├── schemas/     # OpenAPI schemas for auth
│   ├── paths/       # OpenAPI paths for auth endpoints
│   └── index.ts     # Main exports
├── tests/          # Test files
└── package.json
```

Following [creating-ts-packages.md](../lib/monorepo/docs/creating-ts-packages.md), the package.json will be:

```json
{
  "name": "@saf-2025/auth-spec",
  "description": "API specifications for SAF-2025 authentication",
  "private": true,
  "type": "module",
  "main": "src/index.ts",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "@saf-2025/ts-openapi": "*"
  },
  "devDependencies": {
    "@saf-2025/ts-openapi-dev": "*"
  }
}
```

#### Auth SPA Package

The auth SPA package will be created as `@saf-2025/auth-spa` with the following structure:

```
lib/auth-spa/
├── src/
│   ├── components/     # Vue components for auth pages
│   ├── requests/       # API request functions
│   ├── types.ts        # Shared type definitions
│   ├── routes.ts       # Route definitions
│   └── index.ts        # Main exports
├── tests/             # Test files
└── package.json
```

Following [creating-ts-packages.md](../lib/monorepo/docs/creating-ts-packages.md), the package.json will be:

```json
{
  "name": "@saf-2025/auth-spa",
  "description": "Shared authentication components and utilities for SAF-2025",
  "private": true,
  "type": "module",
  "main": "src/index.ts",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "@saf-2025/vue-spa": "*",
    "@saf-2025/ts-openapi": "*",
    "@saf-2025/auth-spec": "*"
  },
  "devDependencies": {
    "@saf-2025/vue-spa-dev": "*"
  }
}
```

### Core Exports

The auth-spec package will export:

1. OpenAPI schemas for auth-related types
2. OpenAPI paths for auth endpoints
3. TypeScript types generated from the OpenAPI specs

The auth-spa package will export:

1. Auth request functions:
   - `useLogin()`
   - `useLogout()`
   - `useRegister()`
2. Route definitions:
   - `authRoutes` array containing the route configurations

### Implementation Strategy

1. **Phase 1: Auth Spec Package**

   - Create auth-spec package structure
   - Define OpenAPI schemas and paths
   - Generate TypeScript types
   - Add tests for the specs

2. **Phase 2: Request Logic Migration**

   - Create auth-spa package structure
   - Copy auth request functions to the new library
   - Update imports to use auth-spec types
   - Add tests for the functions following [query-testing.md](../lib/vue-spa-dev/docs/query-testing.md)

3. **Phase 3: Component Migration**

   - Copy Vue components to the new library
   - Update imports to use the new auth request functions
   - Add component tests following [component-testing.md](../lib/vue-spa-dev/docs/component-testing.md)

4. **Phase 4: Integration**
   - Update existing auth client to use the new library
   - Test the integration
   - Remove old code

### Migration Approach

To ensure a smooth transition:

1. Create and test auth-spec package first
2. Copy files to the new location instead of moving them
3. Add tests for new code
4. Update imports in the existing codebase to use the new library
5. Verify everything works
6. Remove old code

## Questions and Considerations

1. Should we add any additional auth-related utilities or composables?
2. Do we need to support different auth providers or configurations?
3. Should we add any additional route configurations or options?
4. What auth-related schemas should be included in the spec package?

## Success Criteria

1. All auth functionality works as before
2. Tests pass for both packages and the existing implementation
3. The interface is simple and easy to use
4. Products can easily integrate the auth routes into their own router configurations
5. Auth specs are properly isolated and reusable

## Timeline

1. Create auth-spec package and define schemas (1 day)
2. Create library structure and migrate request logic (1 day)
3. Migrate components and add tests (1-2 days)
4. Update existing implementation and verify (1 day)
5. Clean up and documentation (1 day)

Total estimated time: 5-6 days
