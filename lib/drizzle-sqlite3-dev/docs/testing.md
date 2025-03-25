# Testing Drizzle SQLite Queries

This guide covers best practices for testing database queries using Drizzle SQLite. Our tests are designed to be a hybrid between unit and integration tests, ensuring both the query logic and database interactions work as expected.

## Test Database Setup

We use SQLite's in-memory database feature for testing, which provides:

- Fast test execution
- Isolation between test runs
- No need for external database setup

### Database Instance

```typescript
// instance.ts
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import { getDbPath, getMigrationsPath } from "../drizzle.config";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

// Use in-memory database for tests, file-based database otherwise
const sqlite = process.env.VITEST
  ? new Database(":memory:")
  : new Database(getDbPath());

export const db = drizzle(sqlite, { schema });

// Run migrations
migrate(db, { migrationsFolder: getMigrationsPath() });
```

### Test Cleanup

Always clean up relevant tables before each test to ensure a clean state:

```typescript
import { describe, it, beforeEach } from "vitest";
import { db } from "../instance";
import { todos } from "../schema";

describe("todos queries", () => {
  beforeEach(async () => {
    await db.delete(todos);
  });

  // ... tests
});
```

## Test Patterns

### 1. Testing Basic CRUD Operations

Test the happy path first, then error cases:

```typescript
describe("createTodo", () => {
  it("should create a new todo", async () => {
    const result = await createTodo("Test todo");
    expect(result).toMatchObject({
      id: expect.any(Number),
      title: "Test todo",
      completed: false,
    });
  });

  it("should throw ValidationError for empty title", async () => {
    await expect(createTodo("")).rejects.toThrow(ValidationError);
  });
});
```

### 2. Testing Foreign Key Relationships

When testing entities with foreign key relationships, create the required parent records first:

```typescript
describe("createCallLog", () => {
  it("should create a new call log entry", async () => {
    // First create the parent record
    const series = await createCallSeries(1);

    const logData = {
      callSeriesId: series.id,
      type: "TEST",
      retellCallStatus: "registered",
      retellToNumber: "+12125551234",
    };

    const result = await createCallLog(logData);
    expect(result.callSeriesId).toBe(series.id);
  });

  it("should throw error for non-existent parent", async () => {
    await expect(
      createCallLog({
        callSeriesId: 999, // Non-existent ID
        type: "TEST",
        retellCallStatus: "registered",
        retellToNumber: "+12125551234",
      }),
    ).rejects.toThrow(CallSeriesNotFoundError);
  });
});
```

### 3. Testing Time-Based Operations

Use Vitest's time manipulation utilities for testing time-dependent operations:

```typescript
describe("getRecentCallLogs", () => {
  it("should return logs in descending timestamp order", async () => {
    vi.useFakeTimers();
    const series = await createCallSeries(1);

    // Create logs at different times
    const date1 = new Date("2024-03-25T10:00:00Z");
    const date2 = new Date("2024-03-25T11:00:00Z");

    vi.setSystemTime(date1);
    await createCallLog({
      /* ... */
    });

    vi.setSystemTime(date2);
    await createCallLog({
      /* ... */
    });

    const result = await getRecentCallLogs(series.id);
    expect(result[0].timestamp.getTime()).toBe(date2.getTime());
    expect(result[1].timestamp.getTime()).toBe(date1.getTime());

    vi.useRealTimers();
  });
});
```

### 4. Testing Error Handling

Test both handled and unhandled error cases:

```typescript
describe("error handling", () => {
  it("should throw specific error for known cases", async () => {
    await expect(getTodoById(999)).rejects.toThrow(TodoNotFoundError);
  });

  it("should wrap unknown errors", async () => {
    // Force an SQL error
    await db.delete(todos).where(eq(todos.id, "invalid")); // Type mismatch
    await expect(getTodoById(1)).rejects.toThrow(UnhandledDatabaseError);
  });
});
```

## Common Testing Scenarios

### 1. Validation Testing

Test input validation thoroughly:

```typescript
describe("validation", () => {
  it("should validate phone numbers", async () => {
    await expect(
      createCallLog({
        // ...
        retellToNumber: "invalid",
      }),
    ).rejects.toThrow(InvalidPhoneNumberError);
  });

  it("should validate enum values", async () => {
    await expect(
      createCallLog({
        // ...
        retellCallStatus: "invalid_status",
      }),
    ).rejects.toThrow(InvalidCallStatusError);
  });
});
```

### 2. Pagination Testing

Test limit and offset functionality:

```typescript
describe("pagination", () => {
  it("should respect the limit parameter", async () => {
    // Create multiple records
    for (let i = 0; i < 5; i++) {
      await createTodo(`Todo ${i}`);
    }

    const result = await getTodos({ limit: 3 });
    expect(result).toHaveLength(3);
  });
});
```

### 3. Ordering Testing

Test sort order and multiple sort conditions:

```typescript
describe("ordering", () => {
  it("should return items in correct order", async () => {
    const items = await getItems({
      orderBy: [
        { column: "priority", direction: "desc" },
        { column: "createdAt", direction: "asc" },
      ],
    });

    expect(items.map((i) => i.priority)).toEqual([3, 3, 2, 1]); // Should be sorted
  });
});
```

## Best Practices

1. **Clean State**: Always start with a clean database state in each test
2. **Isolation**: Each test should be independent and not rely on data from other tests
3. **Meaningful Data**: Use descriptive test data that makes the test's purpose clear
4. **Error Cases**: Test both expected and unexpected error cases
5. **Type Safety**: Use TypeScript types for test data to catch issues early
6. **Mocking Time**: Use `vi.useFakeTimers()` for time-dependent tests
7. **Cleanup**: Always restore any mocked functionality after tests

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test path/to/test.ts
```
