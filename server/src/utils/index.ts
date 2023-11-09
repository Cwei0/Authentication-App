import express, { Application, Express } from "express";
import { logError, logRequest } from "./event";
import { routes } from "../router/router";
import { dbConnect } from "./db";
import { errorHandler } from "../middlewares/errorMiddleware";
import { accessMiddleware } from "../middlewares/authMiddleware";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import passport from "passport";

/**
 * The main application class responsible for configuring and starting the Express server.
 */
class App {
  private app: Express;

  /**
   * Create an instance of the App class.
   * Initialize the Express application and configure middleware and routes.
   */
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.middlewares();
    this.loadRoutes();
  }

  /**
   * Register middleware functions to be used by the Express app.
   * In this case, it includes logging incoming requests.
   * @private
   */
  private middlewares(): void {
    this.app.use(logRequest);
    this.app.use(cookieParser());
    this.app.use(helmet())
    this.app.use(accessMiddleware);
  }

  /**
   * Load routes for the Express app.
   * Routes are defined in an external module (router/router).
   * Also includes error logging middleware.
   * @private
   */
  private loadRoutes(): void {
    this.app.use(passport.initialize());
    routes(this.app);
    this.app.use(errorHandler);
    this.app.use(logError);
  }

  /**
   * Connect to the MongoDB database.
   * @returns {Promise<void>} A Promise that resolves when the database connection is established.
   */
  public connectToDb(): Promise<void> {
    return dbConnect();
  }

  /**
   * Start the Express application and return the Express Application instance.
   * @returns {Application} The Express Application instance.
   */
  public start(): Application {
    return this.app;
  }
}

export default App;
