import { eq } from "drizzle-orm";
import { db } from "../instance.ts";
import { examples } from "../schema.ts";
import { DatabaseError } from "../errors.ts";

export class ExampleNotFoundError extends DatabaseError {
  constructor(id: number) {
    super(`Example with id ${id} not found`);
    this.name = "ExampleNotFoundError";
  }
}

export interface CreateExample {
  name: string;
  description?: string;
}

export async function create(data: CreateExample) {
  const result = await db
    .insert(examples)
    .values({
      ...data,
      createdAt: new Date(),
    })
    .returning()
    .get();

  return result;
}

export async function get(id: number) {
  const result = await db
    .select()
    .from(examples)
    .where(eq(examples.id, id))
    .get();

  return result;
}

export async function list() {
  return await db.select().from(examples).all();
}

export async function update(id: number, data: Partial<CreateExample>) {
  const result = await db
    .update(examples)
    .set(data)
    .where(eq(examples.id, id))
    .returning()
    .get();

  if (!result) {
    throw new ExampleNotFoundError(id);
  }

  return result;
}

export async function remove(id: number) {
  const result = await db
    .delete(examples)
    .where(eq(examples.id, id))
    .returning()
    .get();

  if (!result) {
    throw new ExampleNotFoundError(id);
  }

  return result;
}
