# Mocking Dependencies

Tests written for node-express services should be unit tests, so they should mock both databases and external integrations they depend on.
When writing tests for services or APIs that use external dependencies, you'll need to mock them properly. Here's the recommended approach using Vitest:

## Mocking Database Modules

```typescript
import * as yourModule from "@your-project/dbs-your-db-name";

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

## Mocking Integration Layers

When mocking integration layers (e.g., external APIs, services), follow a similar pattern:

```typescript
// Mock integration layer
vi.mock("@your-project/integrations-service", async (importOriginal) => {
  const originalModule =
    await importOriginal<typeof import("@your-project/integrations-service")>();

  return {
    ...originalModule,
    service: {
      makeApiCall: vi.fn().mockResolvedValue({
        id: "response-id",
        status: "success",
        data: "test data",
      }),
      getStatus: vi.fn().mockResolvedValue({
        status: "completed",
        result: "operation completed",
      }),
    },
  };
});

// In your test
it("should handle API response", async () => {
  const { service } = await import("@your-project/integrations-service");

  // Test your function
  const result = await yourFunction();

  // Verify service was called correctly
  expect(service.makeApiCall).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      // expected parameters
    }),
  );
});
```

## Real-World Example: Testing Call Series API

Here's a complete example showing how to mock both database and integration layers:

```typescript
// Mock database layer
vi.mock("@vendata/dbs-main", async (importOriginal) => {
  const originalModule =
    await importOriginal<typeof import("@vendata/dbs-main")>();

  const mockCallSeries = {
    id: 1,
    ownerId: 1,
    name: "Test Series",
    phoneNumber: "+12125551234",
  };

  return {
    ...originalModule,
    callSeries: {
      getCallSeriesById: vi.fn().mockImplementation((id, userId) => {
        if (id === 999) throw new originalModule.CallSeriesNotFoundError(id);
        if (userId !== 1)
          throw new originalModule.UnauthorizedAccessError(userId, id);
        return Promise.resolve(mockCallSeries);
      }),
    },
    callSeriesLog: {
      getRecentCallLogs: vi.fn().mockResolvedValue([]),
      createCallLog: vi.fn().mockImplementation((data) => {
        return Promise.resolve({ id: 1, ...data });
      }),
    },
  };
});

// Mock integration layer
vi.mock("@vendata/integrations-retellai", async (importOriginal) => {
  const originalModule =
    await importOriginal<typeof import("@vendata/integrations-retellai")>();

  return {
    ...originalModule,
    call: {
      createPhoneCall: vi.fn().mockResolvedValue({
        call_id: "test-call-id",
        call_status: "registered",
        to_number: "+12125551234",
      }),
      getPhoneCall: vi.fn().mockResolvedValue({
        call_status: "ended",
        transcript: "Previous call discussion",
      }),
    },
  };
});

describe("Call Series API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create test call with context from previous call", async () => {
    const { callSeriesLog } = await import("@vendata/dbs-main");
    const { call } = await import("@vendata/integrations-retellai");

    // Mock recent calls
    vi.mocked(callSeriesLog.getRecentCallLogs).mockResolvedValueOnce([
      {
        id: 1,
        retellCallStatus: "ended",
        retellCallId: "previous-call-id",
      },
    ]);

    const response = await request(app)
      .post("/call-series/1/test-call")
      .set(mockHeaders);

    expect(response.status).toBe(200);
    expect(call.createPhoneCall).toHaveBeenCalledWith(
      expect.any(String),
      "+12125551234",
      expect.stringContaining("Previous call discussion"),
    );
  });
});
```

## Common Pitfalls

1. **Import Order**: You don't need to worry about this, actually. Vitest hoists the mock above the import so in the test, the imported library will be mocked.

2. **Import Style**: Use `import * as moduleName` instead of default imports to capture all exports from the module. Or import the specific things you need such as `import { ... } from "module"`.

3. **Using importOriginal**: Always use `importOriginal` to get the original module's functionality, especially for error classes and other exports you don't want to mock.

4. **Type Safety**: Use TypeScript generics with `importOriginal<typeof import("...")>()` to maintain type safety in your mocks.

5. **Reset Mocks**: Use `vi.clearAllMocks()` in `beforeEach()` to reset mock state between tests.

6. **Partial Mocking**: Only mock the specific methods you need to test. Keep the rest of the module intact to avoid unexpected behavior.

7. **Mock Implementation**: Keep mock implementations simple and focused on the test case. Use `mockResolvedValue` for simple cases and `mockImplementation` when you need conditional logic.

8. **Error Handling**: Always include error cases in your mocks to test error handling paths in your code.

9. **Context Preservation**: When mocking integration layers, preserve any context or state that might be needed across multiple calls (e.g., call transcripts, status updates).
