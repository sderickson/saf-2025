import { db } from "../instance";
import { todos } from "../schema";
import { DatabaseError, UnhandledDatabaseError } from "../errors";
import { eq } from "drizzle-orm";

export async function getAllTodos() {
  try {
    return await db.select().from(todos).orderBy(todos.created_at);
  } catch (error) {
    throw new UnhandledDatabaseError(error);
  }
}

export async function createTodo(title: string) {
  try {
    const result = await db.insert(todos).values({ title }).returning();
    return result[0];
  } catch (error) {
    throw new UnhandledDatabaseError(error);
  }
}

export async function updateTodo(
  id: number,
  title: string,
  completed: boolean
) {
  try {
    const result = await db
      .update(todos)
      .set({ title, completed })
      .where(eq(todos.id, id))
      .returning();

    if (result.length === 0) {
      throw new DatabaseError("Todo not found");
    }

    return result[0];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new UnhandledDatabaseError(error);
  }
}

export async function deleteTodo(id: number) {
  try {
    const result = await db.delete(todos).where(eq(todos.id, id)).returning();

    if (result.length === 0) {
      throw new DatabaseError("Todo not found");
    }

    return result[0];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new UnhandledDatabaseError(error);
  }
}
