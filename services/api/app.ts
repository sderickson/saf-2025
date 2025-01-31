import express from "express";
import logger from "morgan";
import createError from "http-errors";
import * as OpenApiValidator from "express-openapi-validator";
import { join } from "path";
import todoRouter from "./routes/todos";

const app = express();

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// OpenAPI validation
app.use(
  OpenApiValidator.middleware({
    apiSpec: join(__dirname, "../../specs/apis/dist/openapi.json"),
    validateRequests: true,
    validateResponses: true,
  })
);

// Routes
app.use("/api/todos", todoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

export default app;
