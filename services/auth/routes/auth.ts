import express from "express";
import passport from "passport";
import { RequestSchema, ResponseSchema } from "../openapi-types";
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
