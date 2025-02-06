import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { db } from "../instance.ts";
import { exampleTable } from "../schema.ts";
import * as exampleQueries from "./examples.ts";

export function createTestExample(
  override: Partial<typeof exampleTable.$inferInsert> = {}
): typeof exampleTable.$inferInsert {
  return {
    name: "Test Example",
    description: "Test Description",
    ...override,
  } as typeof exampleTable.$inferInsert;
}

describe("examples", () => {
  beforeEach(async () => {
    await db.delete(exampleTable);
  });

  afterEach(async () => {
    await db.delete(exampleTable);
  });

  describe("create", () => {
    it("should create an example with required fields", async () => {
      const data = createTestExample({ description: undefined });
      const result = await exampleQueries.create(data);

      expect(result).toMatchObject({
        id: expect.any(Number),
        name: data.name,
        description: null,
        createdAt: expect.any(Date),
      });
    });

    it("should create an example with all fields", async () => {
      const data = createTestExample();
      const result = await exampleQueries.create(data);

      expect(result).toMatchObject({
        id: expect.any(Number),
        name: data.name,
        description: data.description,
        createdAt: expect.any(Date),
      });
    });
  });

  describe("get", () => {
    it("should get an existing example", async () => {
      const created = await exampleQueries.create(createTestExample());
      const result = await exampleQueries.get(created.id);

      expect(result).toEqual(created);
    });

    it("should return undefined for non-existent example", async () => {
      const result = await exampleQueries.get(999);
      expect(result).toBeUndefined();
    });
  });

  describe("list", () => {
    it("should return empty array when no examples exist", async () => {
      const result = await exampleQueries.list();
      expect(result).toEqual([]);
    });

    it("should return all examples", async () => {
      const example1 = await exampleQueries.create(createTestExample());
      const example2 = await exampleQueries.create(
        createTestExample({ name: "Another Example" })
      );

      const result = await exampleQueries.list();
      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining([example1, example2]));
    });
  });

  describe("update", () => {
    it("should update an existing example", async () => {
      const created = await exampleQueries.create(createTestExample());
      const updateData = { name: "Updated Name" };

      const result = await exampleQueries.update(created.id, updateData);
      expect(result).toMatchObject({
        ...created,
        ...updateData,
      });
    });

    it("should throw ExampleNotFoundError for non-existent example", async () => {
      await expect(
        exampleQueries.update(999, { name: "New Name" })
      ).rejects.toThrow(exampleQueries.ExampleNotFoundError);
    });

    it("should only update specified fields", async () => {
      const created = await exampleQueries.create(createTestExample());
      const updateData = { name: "Updated Name" };

      const result = await exampleQueries.update(created.id, updateData);
      expect(result).toMatchObject({
        ...created,
        name: updateData.name,
      });
      expect(result.description).toBe(created.description);
    });
  });

  describe("remove", () => {
    it("should remove an existing example", async () => {
      const created = await exampleQueries.create(createTestExample());
      const removed = await exampleQueries.remove(created.id);

      expect(removed).toEqual(created);
      const result = await exampleQueries.get(created.id);
      expect(result).toBeUndefined();
    });

    it("should throw ExampleNotFoundError for non-existent example", async () => {
      await expect(exampleQueries.remove(999)).rejects.toThrow(
        exampleQueries.ExampleNotFoundError
      );
    });
  });
});
