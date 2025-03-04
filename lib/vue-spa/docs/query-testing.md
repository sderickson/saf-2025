# Testing Vue Query Hooks

This document explains how to write unit tests for Vue Query hooks in your application.

## Setup

### Test Utils

We use a helper function `withVueQuery` (from `@saf/clients-test-utils`) to properly set up the Vue Query context for testing:

```typescript
function withVueQuery(composable: () => unknown, queryClient?: QueryClient) {
  let result;
  // Create a new QueryClient if one wasn't provided
  const client =
    queryClient ||
    new QueryClient({
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

  app.use(VueQueryPlugin, { queryClient: client });
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
- `userSettings.test.ts` - Testing cache invalidation behavior
- `userProfile.test.ts` - Testing cache invalidation behavior

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

### 1. Setting Up a Shared QueryClient

When testing caching behavior, it's crucial to use a shared QueryClient instance for all related queries and mutations within a test. Create a fresh QueryClient for each test to ensure isolation:

```typescript
describe("my tests", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    // Create a new QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          // Set a long staleTime to ensure data remains fresh and cached
          staleTime: 1000 * 60 * 5, // 5 minutes
        },
      },
    });
  });

  // Tests go here...
});
```

### 2. Testing Query Caching

To verify that the cache is working correctly, make multiple queries with the same parameters and check that the API is only called once:

```typescript
it("should use cache for repeated queries", async () => {
  // Mock the response
  mockGET.mockResolvedValueOnce({ data: mockData, error: null });

  // First query
  const [firstQueryResult, firstApp] = withVueQuery(
    () => useMyQuery(params),
    queryClient
  );
  await firstQueryResult.suspense();

  // Verify first query made an API call
  expect(mockGET).toHaveBeenCalledTimes(1);
  expect(firstQueryResult.data.value).toEqual(mockData);

  // Second query with same parameters
  const [secondQueryResult, secondApp] = withVueQuery(
    () => useMyQuery(params),
    queryClient
  );
  await secondQueryResult.suspense();

  // Verify second query used cache (no additional API call)
  expect(mockGET).toHaveBeenCalledTimes(1); // Still only called once
  expect(secondQueryResult.data.value).toEqual(mockData);

  // Clean up
  firstApp.unmount();
  secondApp.unmount();
});
```

### 3. Testing Cache Invalidation

To test that mutations properly invalidate the cache, follow this pattern:

```typescript
it("should properly use cache and invalidate after update", async () => {
  // Initial data and updated data
  const initialData = {
    /* initial state */
  };
  const updatedData = {
    /* updated state */
  };

  // Mock the GET responses - first for initial fetch, second for refetch after mutation
  mockGET.mockResolvedValueOnce({ data: initialData, error: null });
  mockGET.mockResolvedValueOnce({ data: updatedData, error: null });

  // Mock the mutation response
  mockPATCH.mockResolvedValueOnce({ data: updatedData, error: null });

  // 1. Initial query
  const [getResult, queryApp] = withVueQuery(
    () => useMyQuery(params),
    queryClient
  );
  await getResult.suspense();

  // Verify initial data and that GET was called once
  expect(getResult.data.value).toEqual(initialData);
  expect(mockGET).toHaveBeenCalledTimes(1);

  // 2. Second query (should use cache)
  const [secondQueryResult, secondApp] = withVueQuery(
    () => useMyQuery(params),
    queryClient
  );
  await secondQueryResult.suspense();

  // Verify that no additional GET request was made (cache was used)
  expect(mockGET).toHaveBeenCalledTimes(1);
  expect(secondQueryResult.data.value).toEqual(initialData);

  // 3. Perform mutation
  const [updateResult, mutationApp] = withVueQuery(
    () => useMyMutation(),
    queryClient
  );
  await updateResult.mutateAsync(mutationData);

  // 4. Third query after mutation (should trigger refetch)
  const [thirdQueryResult, thirdApp] = withVueQuery(
    () => useMyQuery(params),
    queryClient
  );
  await thirdQueryResult.suspense();

  // Verify that a new GET request was made (cache was invalidated)
  expect(mockGET).toHaveBeenCalledTimes(2);
  expect(thirdQueryResult.data.value).toEqual(updatedData);

  // Clean up all app instances
  queryApp.unmount();
  secondApp.unmount();
  mutationApp.unmount();
  thirdApp.unmount();
});
```

### 4. Important Configuration Notes

1. **StaleTime**: Set a sufficiently long `staleTime` in the QueryClient configuration to prevent automatic refetching during tests:

   ```typescript
   staleTime: 1000 * 60 * 5, // 5 minutes
   ```

2. **Retry**: Disable retry behavior to make tests more predictable:

   ```typescript
   retry: false,
   ```

3. **Mock Responses**: Use `mockResolvedValueOnce` to provide different responses for initial fetch and post-mutation refetch.

4. **Cleanup**: Remember to unmount all app instances created during the test.

5. **Assertions**: Verify both the number of API calls and the data returned by each query.

### 5. Troubleshooting Cache Tests

If your cache tests are failing:

1. **Check StaleTime**: Ensure `staleTime` is set high enough to prevent automatic refetching.

2. **Verify QueryClient Sharing**: Make sure the same QueryClient instance is passed to all `withVueQuery` calls within a test.

3. **Check Query Keys**: Ensure your query keys are consistent between calls.

4. **Inspect Invalidation Logic**: Verify that your mutation function correctly calls `queryClient.invalidateQueries()` with the appropriate query key.

5. **Timing Issues**: If tests are flaky, you might need to add small delays or use `vi.waitFor()` to wait for async operations to complete.

See `userSettings.test.ts` and `userProfile.test.ts` for complete examples of testing cache behavior with proper invalidation.
