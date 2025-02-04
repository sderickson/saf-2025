import express from "express";
import { RequestSchema, ResponseSchema } from "../openapi-types.js";
export const usersRouter = express.Router();

usersRouter.get("/", async function (req, res, next) {
  try {
    const users: ResponseSchema<"getUsers", 200> = await req.db.users.getAll();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

usersRouter.post("/", async function (req, res, next) {
  const createUserRequest: RequestSchema<"createUser"> = req.body;
  try {
    const result: ResponseSchema<"createUser", 201> = await req.db.users.create(
      {
        email: createUserRequest.email,
        name: createUserRequest.name,
      }
    );
    res.status(201).json(result);
  } catch (e) {
    if (e instanceof req.db.users.EmailConflictError) {
      res.status(409).end();
    }
    next(e);
  }
});
