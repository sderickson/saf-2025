# Auth Refactor Specification

## Overview

This specification outlines the refactoring of auth-related code into a shared library component within the SAF-2025 monorepo. The goal is to make auth functionality reusable across different products while maintaining a simple and flexible interface.

## Goals

1. Create a shared auth library that can be used across different products
2. Keep the interface simple and focused on core functionality
3. Maintain backward compatibility with existing auth implementations
4. Enable products to integrate auth routes as children of their own router configurations

## Non-Goals

1. Creating a complex auth framework with many configuration options
2. Implementing new auth features or changing existing auth behavior
3. Creating a standalone auth application

## Technical Design

### Library Structure

The auth library will be created as `@saf-2025/auth-spa` in the monorepo with the following structure:

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

### Package Setup

Following [creating-ts-packages.md](../lib/monorepo/docs/creating-ts-packages.md), the package.json will be minimal and focused:

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
    "@saf-2025/ts-openapi": "*"
  },
  "devDependencies": {
    "@saf-2025/vue-spa-dev": "*"
  }
}
```

### Core Exports

The library will initially export:

1. Auth request functions:

   - `useLogin()`
   - `useLogout()`
   - `useRegister()`

2. Route definitions:
   - `authRoutes` array containing the route configurations

### Implementation Strategy

1. **Phase 1: Request Logic Migration**

   - Copy auth request functions to the new library
   - Add tests for the functions following [query-testing.md](../lib/vue-spa-dev/docs/query-testing.md)
   - Update exports

2. **Phase 2: Component Migration**

   - Copy Vue components to the new library
   - Update imports to use the new auth request functions
   - Add component tests following [component-testing.md](../lib/vue-spa-dev/docs/component-testing.md)

3. **Phase 3: Integration**
   - Update existing auth client to use the new library
   - Test the integration
   - Remove old code

### Migration Approach

To ensure a smooth transition:

1. Copy files to the new location instead of moving them
2. Add tests for new code
3. Update imports in the existing codebase to use the new library
4. Verify everything works
5. Remove old code

## Questions and Considerations

1. Should we add any additional auth-related utilities or composables?
2. Do we need to support different auth providers or configurations?
3. Should we add any additional route configurations or options?

## Success Criteria

1. All auth functionality works as before
2. Tests pass for both the library and the existing implementation
3. The interface is simple and easy to use
4. Products can easily integrate the auth routes into their own router configurations

## Timeline

1. Create library structure and migrate request logic (1 day)
2. Migrate components and add tests (1-2 days)
3. Update existing implementation and verify (1 day)
4. Clean up and documentation (1 day)

Total estimated time: 4-5 days
