# SQLite Database Template

This template provides a foundation for creating SQLite databases with TypeScript, Drizzle ORM, and comprehensive testing. It's designed to be both a reference implementation and a starting point for new databases.

## Features

- 🎯 TypeScript support with strict typing
- 🗄️ SQLite with Drizzle ORM
- ✨ Automatic migrations
- 🧪 Test infrastructure with Vitest
- 🔄 In-memory database for testing
- ⚡ Efficient CRUD operations
- 🛡️ Error handling patterns

## Directory Structure

```
.
├── src/
│   ├── queries/          # Database operations
│   ├── schema.ts         # Database schema definitions
│   ├── instance.ts       # Database connection setup
│   └── errors.ts         # Custom error definitions
├── migrations/           # Generated migration files
├── data/                 # SQLite database files
├── tests/               # Test files
└── [Config Files]        # Various configuration files
```

## Getting Started

1. Copy this template:

   ```bash
   cp -r dbs/__template__ dbs/your-db-name
   ```

2. Update package name in `package.json`:

   ```json
   {
     "name": "@your-project-name/dbs-your-db-name"
   }
   ```

3. Update the "TemplateDatabaseError" in errors.ts to match your package name
4. Modify the schema in `src/schema.ts` to define your tables
5. Run "npm run generate" to generate migrations files
6. Update queries in `src/queries/` to match your schema
7. Update exports in `index.ts`
8. Add unit tests co-located with the files being tested

## Usage Example

```typescript
import { examples } from "@saf/dbs-your-db-name";

const newExample = await examples.create({
  name: "Test Example",
  description: "Optional description",
});
const example = await examples.get(1);
const allExamples = await examples.list();
const updated = await examples.update(1, { name: "Updated Name" });
await examples.remove(1);
```

## Testing

The template uses Vitest for testing and includes:

- Unit tests for all CRUD operations
- In-memory SQLite database for tests

Run tests:

```bash
npm test           # Run tests once
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Testing Consuming Applications

When testing applications that use database libraries based on this template, follow these best practices:

#### Mocking Database Modules

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

#### Common Pitfalls

1. **Mock Placement**: Always place `vi.mock()` calls after imports but before test definitions. Vitest hoists these calls, but they must be in the correct order.

2. **Error Classes**: Use `importOriginal()` to access the real error classes from the database module. This ensures your error handling tests work correctly.

3. **Partial Mocking**: Only mock the specific methods you need to test. Keep the rest of the module intact to avoid unexpected behavior.

4. **Type Safety**: Use TypeScript generics with `importOriginal<typeof import("...")>()` to maintain type safety in your mocks.

5. **Reset Mocks**: Use `vi.clearAllMocks()` in `beforeEach()` to reset mock state between tests.

## Error Handling

The template includes a robust error handling system:

- Base `DatabaseError` class
- Specific error types (e.g., `ExampleNotFoundError`)
- Consistent error patterns across operations

## Development

### Adding New Tables

1. Define table schema in `src/schema.ts`:

```typescript
export const newTable = sqliteTable("new_table", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // ... other fields
});
```

2. Create queries in `src/queries/new-table.ts`
3. Export from `index.ts`
4. Add tests in `tests/queries/new-table.test.ts`

### Migrations

Migrations are handled automatically by Drizzle. After schema changes:

1. Generate migrations: `npx drizzle-kit generate:sqlite`
2. Migrations run automatically on database initialization

## Best Practices

1. Always include thorough tests for new functionality
2. Use TypeScript types for all database operations
3. Handle errors appropriately using provided error classes
4. Use transactions for multi-step operations
5. Keep queries focused and composable

## Environment Variables

- `NODE_ENV=test`: Uses in-memory SQLite database
- `NODE_ENV=production`: Uses file-based database

## Contributing

When extending this template:

1. Maintain test coverage
2. Update documentation
3. Follow existing patterns for consistency
4. Add examples for new features
