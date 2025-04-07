/**
 * API Service Application
 *
 * Main API service for the SAF architecture.
 * Implements common middleware patterns and routes for various API endpoints.
 */

import express from "express";
import { preMiddleware, errorHandlers } from "./middleware.ts";
import todosRouter from "./routes/todos.ts";

import nodemailer from "nodemailer";

const config = {
  host: "smtp-relay.gmail.com",
  secure: true,
  logger: true,
  debug: true,
  connectionTimeout: 5000,
};
console.log("smtp transporter config", config);
const transporter = nodemailer.createTransport(config);
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP server connection error:", error);
  } else {
    console.log("SMTP server connection successful", success);
  }
});

const testEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: "",
      to: "",
      subject: "Test Email",
      text: "Hello, Scott!",
    });
    console.log("Message sent: %s", info.messageId);
    console.log("info", info);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

testEmail();

const app = express();
app.set("trust proxy", true);

/**
 * Pre-route Middleware Stack
 * Includes request ID, logging, body parsing, and OpenAPI validation
 */
app.use(preMiddleware);

/**
 * Routes
 * API endpoints for various resources
 */
app.use("/todos", todosRouter);

/**
 * Error Handling Middleware Stack
 * Includes 404 handler and centralized error handling
 */
app.use(errorHandlers);

export default app;
