import { eq } from "drizzle-orm";
import { db } from "../instance.ts";
import { exampleTable } from "../schema.ts";
import { DatabaseError } from "../errors.ts";

/**
 * Errors thrown by queries should be defined in the query file itself, and exported by the library.
 */
export class ExampleNotFoundError extends DatabaseError {
  constructor(id: number) {
    super(`Example with id ${id} not found`);
    this.name = "ExampleNotFoundError";
  }
}

// Types should, where possible, be based on drizzle's inferred types.
export async function create(data: typeof exampleTable.$inferInsert) {
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

// "Get" queries should return undefined if the item is not found, not throw an error.
// This allows for better error handling in the calling code.
export async function get(id: number) {
  const result = await db
    .select()
    .from(exampleTable)
    .where(eq(exampleTable.id, id))
    .get();

  return result;
}

export async function list() {
  return await db.select().from(exampleTable).all();
}

// Unsafe queries *should* throw an error if the item is not found, since the operation
// could not be completed as expected.
export async function update(
  id: number,
  data: Partial<typeof exampleTable.$inferInsert>
) {
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

export async function remove(id: number) {
  const result = await db
    .delete(exampleTable)
    .where(eq(exampleTable.id, id))
    .returning()
    .get();

  if (!result) {
    throw new ExampleNotFoundError(id);
  }

  return result;
}
