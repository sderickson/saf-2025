import createError, { HttpError } from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import passport from "passport";
import * as db from "@saf/dbs-auth";
import session from "express-session";
import winston, { Logger } from "winston";
import { requestId, httpLogger } from "@saf/node-express";
import * as OpenApiValidator from "express-openapi-validator";
import apiSpec from "@saf/specs-apis/dist/openapi.json" assert { type: "json" };
import { authRouter } from "./routes/auth.js";
import type { OpenAPIV3 } from "express-openapi-validator/dist/framework/types.d.ts";
import { setupPassport } from "./config/passport.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Define properties added to Express Request objects by middleware
declare global {
  namespace Express {
    interface Request {
      db: typeof db;
      log: Logger;
    }
  }
}

app.get("/health", (req, res) => {
  res.send("OK");
});

// request id generator
app.use(requestId);

// HTTP request logging
app.use(httpLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(
  session({
    store: db.sessionStore,
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
    },
  })
);

// Initialize Passport and restore authentication state from session
setupPassport();
app.use(passport.initialize());
app.use(passport.session());

// db injection
app.use((req, _, next) => {
  req.db = db;
  next();
});

app.use(express.static(path.join(__dirname, "public")));

// winston logger injection
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.printf(({ reqId, level, message, timestamp }) => {
      return `${timestamp} <${reqId}> [${level}]: ${message}`;
    })
  ),
});

// Attach logger to request
app.use((req, res, next) => {
  req.log = logger.child({ reqId: (req as any).id });
  next();
});

// OpenAPI validation
app.use(
  OpenApiValidator.middleware({
    apiSpec: path.join(__dirname, "../../specs/apis/dist/openapi.json"),
    validateRequests: true,
    validateResponses: true,
  })
);

// Routes
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  // Log error
  if (!req.log) {
    console.error(err.stack);
  } else {
    req.log.error(err.stack);
  }

  // Send error response
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
});

export default app;
