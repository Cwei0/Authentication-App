import { NextFunction, Request, Response } from "express";
import { JwtStrategy } from "../utils/auth/jwt";
import log from "../utils/logger";
import { UNAUTHORIZED } from "http-status";

/**
 * Custom error class for token missing errors.
 */
class MissingTokenError extends Error {
  constructor() {
    super("Token is missing");
    this.name = "MissingTokenError";
  }
}

/**
 * Middleware for handling access control with JWT tokens.
 *
 * This middleware checks for the presence of a JWT token in either the cookies
 * or the "Authorization" header. It verifies the token and, if valid, sets user
 * information in `res.locals`. If the token is invalid, it attempts token renewal
 * using a refresh token.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
const accessMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Define an array of routes that should skip the middleware
  const excludedRoutes = ["/", "/auth/local/signup", "/auth/local/signin"];

  // Check if the request path is in the excludedRoutes array
  if (excludedRoutes.includes(req.path)) {
    return next();
  }

  // Attempt to extract the token from cookies or headers
  const token =
    req.cookies.access || req.headers.authorization?.replace(/^Bearer\s/, "");

  // If no token is found, throw a MissingTokenError
  if (!token) {
    throw new MissingTokenError();
  }

  // Initialize a JWT strategy for token verification
  const jwtStrategy = new JwtStrategy();

  // Verify the token and get its status and decoded payload
  const { status, decoded } = await jwtStrategy.verifyJwt(token);

  // If the token is valid, set user information in res.locals and proceed
  if (status === "valid" && decoded) {
    res.locals.user = decoded;
    return next();
  }

  // If the token is invalid and decoded is null, attempt token renewal
  const { refresh } = req.cookies;
  if (status === "invalid" && decoded === null) {
    try {
      // Attempt to renew the token using the refresh token
      const newToken = await jwtStrategy.renewToken(refresh);

      // If a new token is obtained, set it in cookies
      if (newToken) {
        res.cookie("access", newToken, {
          httpOnly: true,
          maxAge: 1 * 60 * 1000,
          sameSite: "strict",
        });
      }

      // Verify the renewed token
      const { decoded, status } = await jwtStrategy.verifyJwt(newToken);

      // If the renewed token is valid, set user information in res.locals and proceed
      if (status === "valid" && decoded) {
        res.locals.user = decoded;
        return next();
      }
    } catch (error) {
      // Handle any errors during token renewal
      log.error(error);
      return res.status(UNAUTHORIZED).json({ message: error });
    }
  }

  // If no valid user is set, continue to the next middleware
  return next();
};

export { accessMiddleware };
