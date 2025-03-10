import express from "express";
import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import type { IVerifyOptions } from "passport-local";
import type { RequestSchema, ResponseSchema } from "@saf/specs-apis";
import { users } from "@saf/dbs-auth";
import * as emailAuth from "@saf/dbs-auth/queries/email-auth";
import * as argon2 from "argon2";
import type { AuthDatabaseError } from "@saf/dbs-auth";
import { createHandler } from "@saf/node-express";

export const authRouter = express.Router();

authRouter.post(
  "/register",
  createHandler(async (req, res, next) => {
    try {
      const registerRequest: RequestSchema<"registerUser"> = req.body;
      const { email, password } = registerRequest;

      // Hash the password with argon2
      const passwordHash = await argon2.hash(password);

      // Create the user
      const user = await users.create({
        email,
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
        };

        res.status(200).json(response);
      });
    } catch (err) {
      const error = err as AuthDatabaseError;
      if (error.name === "EmailConflictError") {
        res.status(409).json({ message: "Email already exists" });
        return;
      }
      next(err);
    }
  })
);

authRouter.post(
  "/login",
  createHandler(async function (req, res, next) {
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
          return res.status(401).json({ message: "Invalid credentials" });
        }

        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }

          const response: ResponseSchema<"loginUser", 200> = {
            id: user.id,
            email: user.email,
          };

          res.json(response);
        });
      }
    )(req, res, next);
  })
);

authRouter.post(
  "/logout",
  createHandler(async (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).end();
    });
  })
);

authRouter.get(
  "/verify",
  createHandler(async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Figure out how to handle OPTIONS in caddy, or at the very least,
    // don't forward_auth OPTIONS requests.

    if (req.headers["x-forwarded-uri"] === "/health") {
      res.status(200).end();
      return;
    }

    if (req.headers["x-forwarded-method"] === "OPTIONS") {
      res.status(200).end();
      return;
    }

    if (!req.isAuthenticated()) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const user = req.user as Express.User;
    // Add user info to response headers for potential use by downstream services
    res.setHeader("X-User-ID", user.id.toString());
    res.setHeader("X-User-Email", user.email);

    // Return user ID and email in the response body
    res.status(200).json({
      id: user.id,
      email: user.email,
    });
  })
);
