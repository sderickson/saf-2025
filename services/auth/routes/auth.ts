import express from "express";
import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import type { IVerifyOptions } from "passport-local";
import type { RequestSchema, ResponseSchema } from "../openapi-types.ts";
import { users } from "@saf/dbs-auth";
import * as emailAuth from "@saf/dbs-auth/queries/email-auth";
import * as argon2 from "argon2";
import type { DatabaseError } from "@saf/dbs-auth";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const registerRequest: RequestSchema<"registerUser"> = req.body;
    const { email, password, name } = registerRequest;

    // Hash the password with argon2
    const passwordHash = await argon2.hash(password);

    // Create the user
    const user = await users.create({
      email,
      name,
      createdAt: new Date(),
    });

    // Create email authentication
    await emailAuth.create({
      userId: user.id,
      email: user.email,
      passwordHash: Buffer.from(passwordHash),
    });

    // Log the user in
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      const response: ResponseSchema<"registerUser", 200> = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      res.status(200).json(response);
    });
  } catch (err) {
    const error = err as DatabaseError;
    if (error.name === "EmailConflictError") {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    next(err);
  }
});

authRouter.post("/login", async function (req, res, next) {
  passport.authenticate(
    "local",
    (
      err: Error | null,
      user: Express.User | false,
      info: IVerifyOptions | undefined
    ) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        const response: ResponseSchema<"loginUser", 200> = {
          id: user.id,
          email: user.email,
          name: user.name,
        };

        res.json(response);
      });
    }
  )(req, res, next);
});

authRouter.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).end();
  });
});

authRouter.post(
  "/verify",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.isAuthenticated()) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const user = req.user as Express.User;
      // Add user info to response headers for potential use by downstream services
      res.setHeader("X-User-ID", user.id.toString());
      res.setHeader("X-User-Email", user.email);

      res.status(200).end();
    } catch (err) {
      next(err);
    }
  }
);
