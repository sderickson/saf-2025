# Mocking Database Modules

Tests written for node-express services should be unit tests, so they should mock databases and 3rd party services they depend on.
When writing tests for services or APIs that use the database, you'll often need to mock the database module. Here's the recommended approach using Vitest:

```typescript
// Important: Place the vi.mock call AFTER the imports
import { describe, it, expect, vi } from "vitest";
import express from "express";
import request from "supertest";
import yourRouter from "./your-router";

// Mock the database module
vi.mock("@your-project/dbs-your-db-name", async (importOriginal) => {
  // Import the original module to get the real error classes
  const originalModule =
    await importOriginal<typeof import("@your-project/dbs-your-db-name")>();

  // Create mock data
  const mockData = {
    id: 1,
    name: "Test Item",
    createdAt: new Date(),
    // ... other fields
  };

  // Create mock implementations
  const mockMethods = {
    getById: vi.fn().mockImplementation((id) => {
      if (id === 999) {
        throw new originalModule.ItemNotFoundError(id);
      }
      return Promise.resolve(mockData);
    }),
    // ... other methods
  };

  return {
    // Keep the original error classes and other exports
    ...originalModule,

    // Override only the specific module you need to mock
    yourModule: mockMethods,
  };
});

// Rest of your test file
```

## Common Pitfalls

1. **Mock Placement**: Always place `vi.mock()` calls after imports but before test definitions. Vitest hoists these calls, but they must be in the correct order.

2. **Error Classes**: Use `importOriginal()` to access the real error classes from the database module. This ensures your error handling tests work correctly.

3. **Partial Mocking**: Only mock the specific methods you need to test. Keep the rest of the module intact to avoid unexpected behavior.

4. **Type Safety**: Use TypeScript generics with `importOriginal<typeof import("...")>()` to maintain type safety in your mocks.

5. **Reset Mocks**: Use `vi.clearAllMocks()` in `beforeEach()` to reset mock state between tests.
