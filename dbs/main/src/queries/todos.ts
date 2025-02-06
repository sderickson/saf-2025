import { db } from "../instance.ts";
import { todos } from "../schema.ts";
import { MainDatabaseError } from "../errors.ts";
import { queryWrapper } from "@saf/drizzle-sqlite3";
import { eq } from "drizzle-orm";

export class TodoNotFoundError extends MainDatabaseError {
  constructor(id: number) {
    super(`Todo with id ${id} not found`);
  }
}

export const getAllTodos = queryWrapper(async () => {
  return await db.select().from(todos).orderBy(todos.created_at);
});

export const createTodo = queryWrapper(async (title: string) => {
  const result = await db.insert(todos).values({ title }).returning();
  return result[0];
});

export const updateTodo = queryWrapper(
  async (id: number, title: string, completed: boolean) => {
    const result = await db
      .update(todos)
      .set({ title, completed })
      .where(eq(todos.id, id))
      .returning();

    if (result.length === 0) {
      throw new TodoNotFoundError(id);
    }

    return result[0];
  }
);

export const deleteTodo = queryWrapper(async (id: number) => {
  const result = await db.delete(todos).where(eq(todos.id, id)).returning();

  if (result.length === 0) {
    throw new TodoNotFoundError(id);
  }

  return result[0];
});
