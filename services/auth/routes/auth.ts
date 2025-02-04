import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import { RequestSchema, ResponseSchema } from "../openapi-types.js";
import { IVerifyOptions } from "passport-local";

export interface User {
  id: string;
  email: string;
}

export const authRouter = express.Router();

authRouter.post("/login", async function (req, res, next) {
  passport.authenticate(
    "local",
    (
      err: Error | null,
      user: User | false,
      info: IVerifyOptions | undefined
    ) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).end();
      }

      const loginRequest: RequestSchema<"loginUser"> = req.body;

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        const response: ResponseSchema<"loginUser", 200> = {
          token: "session-authenticated", // This is just a placeholder
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

      // Add user info to response headers for potential use by downstream services
      res.setHeader("X-User-ID", (req.user as User)?.id || "");
      res.setHeader("X-User-Email", (req.user as User)?.email || "");

      res.status(200).end();
    } catch (err) {
      next(err);
    }
  }
);
