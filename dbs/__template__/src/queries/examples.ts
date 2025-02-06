import { eq } from "drizzle-orm";
import { db } from "../instance.ts";
import { exampleTable } from "../schema.ts";
import { queryWrapper } from "@saf/drizzle-sqlite3";
import { TemplateDatabaseError } from "../errors.ts";
/**
 * Errors thrown by queries should be defined in the query file itself, and exported by the library.
 * These must extend HandledDatabaseError, so that queryWrapper will rethrow them.
 */
export class ExampleNotFoundError extends TemplateDatabaseError {
  constructor(id: number) {
    super(`Example with id ${id} not found`);
    this.name = "ExampleNotFoundError";
  }
}

// Types should, where possible, be based on drizzle's inferred types.
// All queries should be wrapped in queryWrapper, for consistent error handling.
export const create = queryWrapper(
  async (data: typeof exampleTable.$inferInsert) => {
    const result = await db
      .insert(exampleTable)
      .values({
        ...data,
        createdAt: new Date(),
      })
      .returning()
      .get();

    return result;
  }
);

// "Get" queries should return undefined if the item is not found, not throw an error.
// This allows for better error handling in the calling code.
export const get = queryWrapper(async (id: number) => {
  const result = await db
    .select()
    .from(exampleTable)
    .where(eq(exampleTable.id, id))
    .get();

  if (!result) {
    throw new ExampleNotFoundError(id);
  }

  return result;
});

export const list = queryWrapper(async () => {
  return await db.select().from(exampleTable).all();
});

// Unsafe queries *should* throw an error if the item is not found, since the operation
// could not be completed as expected.
export const update = queryWrapper(
  async (id: number, data: Partial<typeof exampleTable.$inferInsert>) => {
    const result = await db
      .update(exampleTable)
      .set(data)
      .where(eq(exampleTable.id, id))
      .returning()
      .get();

    if (!result) {
      throw new ExampleNotFoundError(id);
    }

    return result;
  }
);

export const remove = queryWrapper(async (id: number) => {
  const result = await db
    .delete(exampleTable)
    .where(eq(exampleTable.id, id))
    .returning()
    .get();

  if (!result) {
    throw new ExampleNotFoundError(id);
  }

  return result;
});
