# @saf/drizzle-sqlite3

A utility library for working with SQLite3 databases using Drizzle ORM in the SAF monorepo and projects which depend on it. This package provides error handling utilities and query wrappers to create a consistent error handling pattern across database consumers.

## Installation

This package is part of the SAF monorepo workspace. It's automatically available to other packages in the workspace - no explicit installation needed.

```typescript
import {
  queryWrapper,
  HandledDatabaseError,
  UnhandledDatabaseError,
} from "@saf/drizzle-sqlite3";
```

## Features

### Error Handling

- Standardized database error types
- Error classification into handled vs. unhandled errors
- Query wrapper to standardize error handling

## Usage

### Error Handling Pattern

This library implements a two-tier error handling approach:

1. **Database Layer**: Uses `queryWrapper` to catch and classify database errors
2. **Service Layer**: Catches specific handled errors and reports generic errors for unhandled ones

### Creating Database Queries with Error Handling

```typescript
// In your database layer (e.g., queries/todos.ts)
import { queryWrapper, HandledDatabaseError } from "@saf/drizzle-sqlite3";
import { eq } from "drizzle-orm";
import { todos } from "../schema";

// Define specific handled errors
export class TodoNotFoundError extends HandledDatabaseError {
  constructor(id: string) {
    super(`Todo with ID ${id} not found`, "TODO_NOT_FOUND");
  }
}

// Wrap database queries to standardize error handling
export const getTodoById = (db) => async (id: string) => {
  return queryWrapper(async () => {
    const todo = await db.query.todos.findFirst({
      where: eq(todos.id, id),
    });

    if (!todo) {
      throw new TodoNotFoundError(id);
    }

    return todo;
  });
};
```

### Consuming Database Queries in Services

```typescript
// In your service layer
import { UnhandledDatabaseError } from "@saf/drizzle-sqlite3";
import { getTodoById, TodoNotFoundError } from "../queries/todos";

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

    if (error instanceof UnhandledDatabaseError) {
      // Log the internal error but don't expose details to client
      console.error("Database error:", error);
      return res.status(500).json({
        error: { message: "Internal server error", code: "INTERNAL_ERROR" },
      });
    }

    // Pass other errors to Express error handler
    next(error);
  }
});
```

### Creating Custom Database Errors

Extend the `HandledDatabaseError` class to create specific error types:

```typescript
import { HandledDatabaseError } from "@saf/drizzle-sqlite3";

// Create specific error types for your domain
export class DuplicateUserError extends HandledDatabaseError {
  constructor(email: string) {
    super(`User with email ${email} already exists`, "DUPLICATE_USER");
  }
}

export class InvalidDataError extends HandledDatabaseError {
  constructor(field: string) {
    super(`Invalid data for field: ${field}`, "INVALID_DATA");
  }
}

// Export these errors for consumers to catch
```

## Database Schema Best Practices

### Data Types

- **IDs**: Use `integer` type for primary keys and foreign keys

  ```typescript
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  ```

- **JSON Data**: Use `text` with `{ mode: "json" }` for JSON data

  ```typescript
  preferences: text("preferences", { mode: "json" }).$type<string[]>(),
  metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>(),
  ```

- **Timestamps**: Use `integer` with `{ mode: "timestamp" }` for dates

  ```typescript
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ```

- **Currency**: Use `integer` for monetary values (store in cents)
  ```typescript
  price: integer("price").notNull(), // Stored in cents
  ```

### Relationships

- **User IDs**: For external user IDs (from auth service), use `integer` type

  ```typescript
  userId: integer("user_id").notNull().unique(),
  ```

- **One-to-One Relationships**: Add unique constraints
  ```typescript
  profileId: integer("profile_id").notNull().unique(),
  ```

## Query Pattern Best Practices

### Upsert Pattern

For one-to-one relationships (like user profiles or settings), implement an "upsert" pattern:

```typescript
// Upsert a user profile (create if it doesn't exist, update if it does)
export const upsertUserProfile = queryWrapper(
  async (
    userId: number,
    profileData: Partial<NewUserProfile>
  ): Promise<UserProfile> => {
    // Check if a profile already exists for this user
    const existingProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));

    if (existingProfile.length > 0) {
      // Update existing profile
      const result = await db
        .update(userProfiles)
        .set({
          ...profileData,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, userId))
        .returning();

      return result[0];
    } else {
      // Create a new profile
      const result = await db
        .insert(userProfiles)
        .values({
          userId,
          ...profileData,
          updatedAt: new Date(),
        })
        .returning();

      return result[0];
    }
  }
);
```

### Error Handling

Always create specific error classes for common error cases:

```typescript
export class ProfileNotFoundError extends MainDatabaseError {
  constructor(userId: number) {
    super(`Profile for user with id ${userId} not found`);
  }
}
```

### Validation

Perform validation before database operations:

```typescript
if (!isValidEmail(email)) {
  throw new InvalidDataError("email");
}
```

## Development

1. Run tests:

   ```bash
   pnpm test
   ```

2. Run tests in watch mode:

   ```bash
   pnpm test:watch
   ```

3. Run tests with coverage:
   ```bash
   pnpm test:coverage
   ```

## Contributing

When contributing to this library:

1. Add comprehensive tests for new features
2. Update this README with relevant examples
3. Follow the existing error handling patterns
4. Ensure type safety with TypeScript
