import { NextFunction, Request, Response } from "express";
import log from "../utils/logger";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "http-status";

export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.error(err);
  if (err instanceof CustomError) {
    return res.status(BAD_REQUEST).json({ error: err.message });
  }

  return res
    .status(INTERNAL_SERVER_ERROR)
    .json({ error: "Internal Server Error" });
};
