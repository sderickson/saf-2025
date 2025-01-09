const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const corsOptions = require('./cors-config');
const db = require('db');
const winston = require('winston');
const uuid = require('uuid');

const app = express();

app.use((req, res, next) => {
  req.id = uuid.v4().slice(0, 8);
  next();
})

// 3rd party middleware
morgan.token('id', (req) => req.id);
app.use(morgan(':date[iso] <:id> :method :url :status :response-time ms - :res[content-length]'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// db injection
const dbInstance = db.createDatabase();
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

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  req.log.error(err.stack);
  res.status(err.status || 500);
  res.send("Error");
});

module.exports = app;
