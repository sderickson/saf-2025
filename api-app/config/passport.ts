import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../routes/auth";

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    // TODO: Replace with actual user lookup from your database
    const user = { id, email: "user@example.com" };
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // TODO: Replace with actual user authentication logic
        if (email === "user@example.com" && password === "password") {
          const user = { id: "1", email };
          return done(null, user);
        }
        return done(null, false, { message: "Invalid credentials" });
      } catch (err) {
        return done(err);
      }
    }
  )
);
