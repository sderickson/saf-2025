# External User Guide

This guide is for consumers of databases which depend on this library.

## Error Handling

Databases which use this library will export and throw specific error objects.

### Consuming Database Queries in Services

```typescript
// In your service layer
import { getTodoById, TodoNotFoundError } from "@your-product/dbs-main";

app.get("/todos/:id", async (req, res, next) => {
  try {
    const todo = await getTodoById(db)(req.params.id);
    res.json(todo);
  } catch (error) {
    if (error instanceof TodoNotFoundError) {
      // Handle specific error with appropriate status code
      return res.status(404).json({
        error: { message: error.message, code: error.code },
      });
    }
    // Pass other errors to Express error handler
    next(error);
  }
});
```

## Testing

When testing applications that use database libraries based on this template, follow these best practices:

### Mocking Database Modules

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

### Common Pitfalls

1. **Mock Placement**: Always place `vi.mock()` calls after imports but before test definitions. Vitest hoists these calls, but they must be in the correct order.

2. **Error Classes**: Use `importOriginal()` to access the real error classes from the database module. This ensures your error handling tests work correctly.

3. **Partial Mocking**: Only mock the specific methods you need to test. Keep the rest of the module intact to avoid unexpected behavior.

4. **Type Safety**: Use TypeScript generics with `importOriginal<typeof import("...")>()` to maintain type safety in your mocks.

5. **Reset Mocks**: Use `vi.clearAllMocks()` in `beforeEach()` to reset mock state between tests.
