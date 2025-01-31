import createError, { HttpError } from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import morgan from "morgan";
import passport from "passport";
import * as db from "../../dbs/auth";
import session from "express-session";
import winston, { Logger } from "winston";
import { v4 as uuidv4 } from "uuid";
import * as OpenApiValidator from "express-openapi-validator";
import openApiSpec from "../../specs/apis/dist/openapi.json";
import { usersRouter } from "./routes/users";
import { authRouter } from "./routes/auth";
import { OpenAPIV3 } from "express-openapi-validator/dist/framework/types";
import "./config/passport";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Define properties added to Express Request objects by middleware
declare global {
  namespace Express {
    interface Request {
      id: string;
      db: typeof db;
      log: Logger;
    }
    // Add User type for Passport
    interface User {
      id: string;
      email: string;
    }
  }
}

app.get("/health", (req, res) => {
  res.send("OK");
});

// request id generator
app.use((req, res, next) => {
  req.id = uuidv4().slice(0, 8);
  next();
});

// 3rd party middleware
morgan.token("id", (req: Request) => req.id);
app.use(
  morgan(
    ":date[iso] <:id> :method :url :status :response-time ms - :res[content-length]"
  )
);
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
app.use((req, res, next) => {
  req.log = logger.child({ reqId: req.id });
  next();
});

app.use(
  OpenApiValidator.middleware({
    apiSpec: openApiSpec as OpenAPIV3.DocumentV3,
    validateRequests: true,
    validateResponses: true,
  })
);

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (!req.log) {
    console.error(err.stack);
  } else {
    req.log.error(err.stack);
  }
  res.status(err.status || 500);
  res.send("Error");
});

module.exports = app;
