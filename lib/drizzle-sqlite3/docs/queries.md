# Writing Queries

Queries are the "public" interface for the database. Services should not craft their own SQL queries, they should be housed in the "queries" folder of the database library and exported for general use. This enforces the following layering:

1. **Database Layer**: Uses `queryWrapper` to catch and classify database errors
2. **Service Layer**: Catches specific handled errors and reports generic errors for unhandled ones

This way, the database layer never exposes errors emitted by SQLite. If it did, service layers may try
to handle them directly and this would lead to tight coupling.

### Creating Database Queries with Error Handling

```typescript
// In your database layer (e.g., queries/todos.ts)
import { queryWrapper, HandledDatabaseError } from "@saflib/drizzle-sqlite3";
import { eq } from "drizzle-orm";
import { todos } from "../schema";
import { db } from "../instance";

// Define specific handled errors
export class TodoNotFoundError extends HandledDatabaseError {
  constructor(id: string) {
    super(`Todo with ID ${id} not found`, { code: "TODO_NOT_FOUND" });
  }
}

// Wrap database queries to standardize error handling
export const getTodoById = queryWrapper(async (id: string) => {
  const todo = await db.query.todos.findFirst({
    where: eq(todos.id, id),
  });

  if (!todo) {
    throw new TodoNotFoundError(id);
  }

  return todo;
});
```

### Creating Custom Database Errors

Extend the `HandledDatabaseError` class to create specific error types:

```typescript
import { HandledDatabaseError } from "@saflib/drizzle-sqlite3";

// Create specific error types for your domain
export class DuplicateUserError extends HandledDatabaseError {
  constructor(email: string) {
    super(`User with email ${email} already exists`, {
      code: "DUPLICATE_USER",
    });
  }
}

export class InvalidDataError extends HandledDatabaseError {
  constructor(field: string) {
    super(`Invalid data for field: ${field}`, { code: "INVALID_DATA" });
  }
}

// Export these errors for consumers to catch
```

## Query Pattern Best Practices

### Database Instance

Always use the imported `db` instance from `instance.ts`. Never inject the database instance as a parameter to your queries. This ensures consistent database access across your application.

The database instance is configured based on the environment:

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

// Usage in queries:
export const createTodo = queryWrapper(async (title: string) => {
  return db.insert(todos).values({ title }).returning();
});

// ❌ Incorrect: Don't inject db as parameter
export const createTodo = (db) =>
  queryWrapper(async (title: string) => {
    return db.insert(todos).values({ title }).returning();
  });
```

### Upsert Pattern

For one-to-one relationships (like user profiles or settings), implement an "upsert" pattern:

```typescript
import { db } from "../instance";

// Upsert a user profile (create if it doesn't exist, update if it does)
export const upsertUserProfile = queryWrapper(
  async (
    userId: number,
    profileData: Partial<NewUserProfile>,
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
  },
);
```

### Error Handling

Always create specific error classes for common error cases:

```typescript
export class ProfileNotFoundError extends HandledDatabaseError {
  constructor(userId: number) {
    super(`Profile for user with id ${userId} not found`, {
      code: "PROFILE_NOT_FOUND",
    });
  }
}
```

### Validation

Perform validation before database operations. It is the responsibility of the database layer to ensure data integrity.

```typescript
function validateEmail(email: string): asserts email is string {
  if (!isValidEmail(email)) {
    throw new InvalidDataError("email");
  }
}

export const createUser = queryWrapper(async (email: string) => {
  validateEmail(email);
  return db.insert(users).values({ email }).returning();
});
```
