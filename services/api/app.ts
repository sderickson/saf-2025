import createError, { HttpError } from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { Logger } from "winston";
import {
  requestId,
  httpLogger,
  loggerInjector,
  openApiValidator,
} from "@saf/node-express";
import apiSpec from "@saf/specs-apis/dist/openapi.json" assert { type: "json" };
import todosRouter from "./routes/todos.js";
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

app.use(express.static(path.join(__dirname, "public")));

// Logger injection
app.use(loggerInjector);

// OpenAPI validation
app.use(openApiValidator);

// Routes
app.use("/todos", todosRouter);

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
