import { int, sqliteTable, text, blob } from "drizzle-orm/sqlite-core";

// As a general rule, this table should contain members listed in OIDC Standard Claims.
// See: https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
export const users = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  createdAt: int("created_at", { mode: "timestamp" }).notNull(),
  lastLoginAt: int("last_login_at", { mode: "timestamp" }),
  name: text().notNull(),
  email: text().notNull().unique(),
});

// Email authentication
export const emailAuth = sqliteTable("email_auth", {
  userId: int("user_id")
    .notNull()
    .references(() => users.id)
    .unique(),
  email: text("email").notNull().unique(),
  passwordHash: blob("password_hash").notNull(),

  // Verification
  verifiedAt: int("verified_at", { mode: "timestamp" }),
  verificationToken: text("verification_token"),
  verificationTokenExpiresAt: int("verification_token_expires_at", {
    mode: "timestamp",
  }),

  // Forgot password
  forgotPasswordToken: text("forgot_password_token"),
  forgotPasswordTokenExpiresAt: int("forgot_password_token_expires_at", {
    mode: "timestamp",
  }),
});

// TODO: Add Google and Facebook OAuth
// // Google OAuth
// export const googleAuth = sqliteTable("google_auth", {
//   userId: int("user_id")
//     .notNull()
//     .references(() => users.id)
//     .unique(),
//   googleId: text("google_id").notNull().unique(),
//   email: text("email").notNull(),
// });

// // Facebook OAuth
// export const facebookAuth = sqliteTable("facebook_auth", {
//   userId: int("user_id")
//     .notNull()
//     .references(() => users.id)
//     .unique(),
//   facebookId: text("facebook_id").notNull().unique(),
//   email: text("email").notNull(),
// });
