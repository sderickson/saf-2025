# Testing Vue Query Hooks

This document explains how to write unit tests for Vue Query hooks in your application.

## Setup

### Test Utils

We use a helper function `withVueQuery` (from `@saf/clients-test-utils`) to properly set up the Vue Query context for testing:

```typescript
function withVueQuery(composable: () => unknown) {
  let result;
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });

  const app = createApp({
    setup() {
      result = composable();
      return () => {};
    },
  });

  app.use(VueQueryPlugin, { queryClient });
  app.mount(document.createElement("div"));

  return [result, app] as const;
}
```

### Mocking HTTP Client

Mock the client at the start of your test file:

```typescript
vi.mock("./client", () => ({
  client: {
    GET: vi.fn(),
    POST: vi.fn(),
    PUT: vi.fn(),
    DELETE: vi.fn(),
  },
}));
```

## Writing Tests

### 1. Testing Query Hooks

For hooks that fetch data (using `useQuery`):

```typescript
describe("useMyQuery", () => {
  it("should fetch data", async () => {
    // 1. Mock the response
    const mockData = {
      /* your mock data */
    };
    mockGET.mockResolvedValueOnce({ data: mockData });

    // 2. Set up the query
    const [result, app] = withVueQuery(() => useMyQuery());

    // 3. Wait for the query to complete
    await result.suspense();

    // 4. Clean up
    app.unmount();

    // 5. Assert
    expect(mockGET).toHaveBeenCalledWith("/your-endpoint");
    expect(result.data.value).toEqual(mockData);
  });

  it("should handle null response", async () => {
    mockGET.mockResolvedValueOnce({ data: null });
    // ... similar pattern
  });
});
```

### 2. Testing Mutation Hooks

For hooks that modify data (using `useMutation`):

```typescript
describe("useMyMutation", () => {
  it("should perform mutation", async () => {
    // 1. Mock the response
    const mockResponse = {
      /* your mock response */
    };
    mockPOST.mockResolvedValueOnce({ data: mockResponse });

    // 2. Set up the mutation
    const [result, app] = withVueQuery(() => useMyMutation());

    // 3. Execute the mutation
    const response = await result.mutateAsync(mutationData);

    // 4. Clean up
    app.unmount();

    // 5. Assert
    expect(mockPOST).toHaveBeenCalledWith("/your-endpoint", {
      body: mutationData,
    });
    expect(response).toEqual(mockResponse);
  });

  it("should handle errors", async () => {
    mockPOST.mockResolvedValueOnce({ data: null });
    const [result, app] = withVueQuery(() => useMyMutation());

    await expect(result.mutateAsync(mutationData)).rejects.toThrow(
      "Expected error message"
    );

    app.unmount();
  });
});
```

## Best Practices

1. **Clean Up**: Always call `app.unmount()` after your tests to prevent memory leaks.

2. **Mock Clearing**: Clear mocks in `beforeEach` to ensure clean state:

   ```typescript
   beforeEach(() => {
     mockGET.mockClear();
     mockPOST.mockClear();
     // etc...
   });
   ```

3. **Type Safety**: Use proper typing for your mock data and responses to catch type errors early.

4. **Error Testing**: Always include error cases to ensure proper error handling.

5. **Async/Await**: Use `async/await` with:
   - `result.suspense()` for queries
   - `result.mutateAsync()` for mutations

## Examples

See complete examples in:

- `auth.test.ts` - Testing authentication mutations
- `todos.test.ts` - Testing both queries and mutations for a CRUD interface

## Common Patterns

1. **Query Testing**:

   - Test successful data fetching
   - Test empty/null responses
   - Test error handling
   - Test query caching behavior

2. **Mutation Testing**:

   - Test successful operations
   - Test error cases
   - Verify correct endpoint and payload
   - Test response handling
   - Test query cache invalidation

3. **Setup/Teardown**:
   - Mock HTTP methods
   - Clear mocks between tests
   - Clean up Vue instances

## Testing Query Cache Behavior

Vue Query maintains a cache of query results and automatically invalidates it when mutations occur. Here's how to test this behavior:

### 1. Testing Query Caching

When testing caching behavior, it's important to configure the QueryClient properly:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false, // Prevent automatic refetching
      staleTime: Infinity, // Consider data as never stale
    },
    mutations: {
      retry: false,
    },
  },
});
```

Then test the caching behavior:

```typescript
it("should cache query results", async () => {
  // Set up initial query response
  mockGET.mockResolvedValue({ data: mockData });

  // First query
  const [result1, app1] = withVueQuery(() => useMyQuery(), queryClient);
  await result1.suspense();
  expect(mockGET).toHaveBeenCalledTimes(1);

  // Second query should use cache
  const [result2, app2] = withVueQuery(() => useMyQuery(), queryClient);
  await result2.suspense();
  expect(mockGET).toHaveBeenCalledTimes(1); // Still only called once

  // Verify both queries have the same data
  expect(result1.data.value).toEqual(mockData);
  expect(result2.data.value).toEqual(mockData);

  // Clean up
  app1.unmount();
  app2.unmount();
});
```

### 2. Testing Cache Invalidation

When testing mutations that should invalidate the query cache:

```typescript
it("should invalidate cache after mutation", async () => {
  // Set up and execute initial query
  mockGET.mockResolvedValue({ data: mockData });
  const [queryResult, queryApp] = withVueQuery(() => useMyQuery(), queryClient);
  await queryResult.suspense();
  expect(mockGET).toHaveBeenCalledTimes(1);

  // Perform mutation
  const [mutationResult, mutationApp] = withVueQuery(
    () => useMyMutation(),
    queryClient
  );
  await mutationResult.mutateAsync(mutationData);

  // Wait for cache invalidation and verify refetch
  await new Promise((resolve) => setTimeout(resolve, 10));
  expect(mockGET).toHaveBeenCalledTimes(2);

  // Clean up
  queryApp.unmount();
  mutationApp.unmount();
});
```

Key Points:

- Configure QueryClient with appropriate settings for testing cache behavior
- Use `mockResolvedValue` instead of `mockResolvedValueOnce` when you expect multiple calls
- Add a small delay after mutation to allow for cache invalidation
- Keep track of both query and mutation app instances for cleanup
- Verify the number of times the query endpoint is called
- Share the same QueryClient instance between related queries and mutations

See `todos.test.ts` for complete examples of testing cache behavior with create, update, and delete operations.
