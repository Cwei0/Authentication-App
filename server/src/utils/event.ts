import fs from "fs";
import { format } from "date-fns";
import EventEmitter from "events";
import path from "path";
import { NextFunction, Request, Response } from "express";

// Define a custom type for timestamps
interface Date {
  timestamps: string;
}

// Define the shape of the request object
interface IRequest {
  url: string;
  method: string;
  headers: {
    origin: string | undefined;
  };
}

// Define the shape of error objects
interface IErrors {
  name: string;
  stack: string;
  message: string;
}

// Generate a timestamp for the current date and time
const dateTime: Date["timestamps"] = `${format(
  new Date(),
  "yyyy-MM-dd\tHH:mm:ss"
)}`;

// Custom logger class that extends EventEmitter
class Logger extends EventEmitter {
  private requestLogStream: fs.WriteStream;
  private errorLogStream: fs.WriteStream;

  constructor() {
    super();

    // Create log directory if it doesn't exist
    const logDir = path.join(__dirname, "..", "logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    // Set up streams for request and error logs
    const requestLogFilePath = path.join(logDir, "requests.log");
    this.requestLogStream = fs.createWriteStream(requestLogFilePath, {
      flags: "a",
    });

    const errorLogFilePath = path.join(logDir, "errors.log");
    this.errorLogStream = fs.createWriteStream(errorLogFilePath, {
      flags: "a",
    });
  }

  /**
   * Log a request.
   * @param req - The request object.
   */
  logRequest(req: IRequest) {
    // Emit an event for request logging
    this.emit("requests.log", req);

    // Write the request details to the request log stream
    this.requestLogStream.write(
      `${dateTime}\t${req.url}\t${req.method}\t${req.headers.origin}\n`
    );
  }

  /**
   * Log an error.
   * @param err - The error object.
   */
  logError(err: IErrors) {
    // Emit an event for error logging
    this.emit("error.log", err);

    // Write the error details to the error log stream
    this.errorLogStream.write(
      `${dateTime}\t${err.name}:${err.message}\n ${err.stack}\n`
    );
  }
}

// Create an instance of the Logger class
const logger = new Logger();

/**
 * Middleware to log incoming requests.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
async function logRequest(req: Request, res: Response, next: NextFunction) {
  const requestLog: IRequest = {
    url: req.url,
    method: req.method,
    headers: {
      origin: req.headers.origin,
    },
  };
  await logger.logRequest(requestLog);

  next();
}

/**
 * Middleware to log errors.
 * @param err - The error object.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
async function logError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errorLog: IErrors = {
    name: err.name,
    message: err.message,
    stack: err.stack,
  };
  await logger.logError(errorLog);

  next();
}

export { logError, logRequest };
