# SAF Client Test Utilities

This package provides testing utilities for SAF client applications.

## Installation

```bash
npm install @saf/clients-test-utils
```

## Usage

### withVueQuery

The `withVueQuery` function helps test Vue Query composables in isolation:

```typescript
import { withVueQuery } from "@saf/clients-test-utils";
import { useMyQuery } from "./my-query";

describe("useMyQuery", () => {
  it("should fetch data", async () => {
    const [result, app] = withVueQuery(() => useMyQuery());

    // Test your query
    expect(result.data.value).toEqual(expectedData);

    // Always unmount the app when done
    app.unmount();
  });
});
```

### Type Guards

The package includes type guards to help with TypeScript type narrowing:

```typescript
import {
  withVueQuery,
  isQueryResult,
  isMutationResult,
} from "@saf/clients-test-utils";
import { useMyComposable } from "./my-composable";

describe("useMyComposable", () => {
  it("should return a query result", () => {
    const [result, app] = withVueQuery(() => useMyComposable());

    if (isQueryResult(result)) {
      // TypeScript now knows this is a query result
      expect(result.data.value).toEqual(expectedData);
    }

    app.unmount();
  });
});
```

## API Reference

### withVueQuery

```typescript
function withVueQuery<T>(
  composable: () => T,
  queryClient?: QueryClient,
): [T, App<Element>, QueryClient];
```

- `composable`: The composable function to test
- `queryClient`: Optional custom query client
- Returns: A tuple containing the composable result, the Vue app instance, and the query client

### isQueryResult

```typescript
function isQueryResult<TData = unknown, TError = Error>(
  result: unknown,
): result is UseQueryReturnType<TData, TError>;
```

Type guard to check if a result is a `UseQueryReturnType`.

### isMutationResult

```typescript
function isMutationResult<
  TData = unknown,
  TError = Error,
  TVariables = unknown,
  TContext = unknown,
>(
  result: unknown,
): result is UseMutationReturnType<TData, TError, TVariables, TContext>;
```

Type guard to check if a result is a `UseMutationReturnType`.

## Types

The package re-exports the following types from `@tanstack/vue-query`:

- `UseQueryReturnType`
- `UseMutationReturnType`
