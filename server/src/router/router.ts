import { Express, Request, Response } from "express";
import { validate } from "../middlewares/validateMiddleware";
import {
  authenticateUserSchema,
  createUserSchema,
} from "../schemas/user.schema";
import { UserController } from "../controllers/auth.controller";
import { requireUser } from "../middlewares/requireUserMiddleware";

/**
 * Intializes the routes as a functional component.
 * @param {Express} app - The express app
 */

function routes(app: Express) {
  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World" });
  });

  // Local User Authentication and Authorization
  const user = new UserController();
  app.post(
    "/auth/local/signup",
    validate(createUserSchema),
    user.createNewUser.bind(user)
  );
  app.post(
    "/auth/local/signin",
    validate(authenticateUserSchema),
    user.authenticateUser.bind(user)
  );

  app.post("/auth/local/forgot-password");
  app.post("/auth/local/reset-password");
  app.get("/auth/currentuser", requireUser, user.getCurrentUser.bind(user));
}

export { routes };
