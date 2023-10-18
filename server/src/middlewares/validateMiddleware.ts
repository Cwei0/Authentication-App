import { NextFunction, Request, Response } from "express";
import { BAD_REQUEST } from "http-status";
import { AnyZodObject } from "zod";

/**
 * Middleware for request data validation using a Zod schema.
 *
 * @param schema - The Zod schema to validate the request data against.
 * @returns Express middleware function.
 */
const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Attempt to parse and validate the request data against the provided schema.
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // If validation succeeds, pass control to the next middleware or route handler.
      next();
    } catch (error) {
      // If validation fails, respond with a 400 Bad Request status and the validation error.
      return res.status(BAD_REQUEST).send(error);
    }
  };

export { validate };
