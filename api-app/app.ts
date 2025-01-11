import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction } from "express";
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import { corsOptions } from './cors-config';
import { createDatabase } from 'db';
import winston, { Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';

const app = express();

// Define properties added to Express Request objects by middleware
declare global {
  namespace Express {
    interface Request {
      id: string;
      db: ReturnType<typeof createDatabase>;
      log: Logger;
    }
  }
}

app.use((req, res, next) => {
  req.id = uuidv4().slice(0, 8);
  next();
})

// 3rd party middleware
morgan.token('id', (req: Request) => req.id);
app.use(morgan(':date[iso] <:id> :method :url :status :response-time ms - :res[content-length]'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// db injection
const dbInstance = createDatabase();
app.use((req, _, next) => {
  req.db = dbInstance;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

// winston logger injection
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.printf(({ reqId, level, message, timestamp }) => {
      return `${timestamp} <${reqId}> [${level}]: ${message}`;
    })
  ),
})
app.use((req, res, next) => {
  req.log = logger.child({reqId: req.id});
  next();
});

import { usersRouter } from './routes/users';
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
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
