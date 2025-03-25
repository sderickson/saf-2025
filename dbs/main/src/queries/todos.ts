import { db } from "../instance.ts";
import { todos } from "../schema.ts";
import { MainDatabaseError } from "../errors.ts";
import { queryWrapper } from "@saflib/drizzle-sqlite3";
import { eq } from "drizzle-orm";

export class TodoNotFoundError extends MainDatabaseError {
  constructor(id: number) {
    super(`Todo with id ${id} not found`);
  }
}

export type Todo = typeof todos.$inferSelect;

export const getAllTodos = queryWrapper(async (): Promise<Todo[]> => {
  return await db.select().from(todos).orderBy(todos.createdAt);
});

export const createTodo = queryWrapper(async (title: string): Promise<Todo> => {
  const result = await db
    .insert(todos)
    .values({ title, createdAt: new Date() })
    .returning();
  return result[0];
});

export const updateTodo = queryWrapper(
  async (id: number, title: string, completed: boolean): Promise<Todo> => {
    const result = await db
      .update(todos)
      .set({ title, completed })
      .where(eq(todos.id, id))
      .returning();

    if (result.length === 0) {
      throw new TodoNotFoundError(id);
    }

    return result[0];
  },
);

export const deleteTodo = queryWrapper(async (id: number): Promise<Todo> => {
  const result = await db.delete(todos).where(eq(todos.id, id)).returning();

  if (result.length === 0) {
    throw new TodoNotFoundError(id);
  }

  return result[0];
});
