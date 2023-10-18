import { env } from "process";
import { set, connect } from "mongoose";
import log from "./logger";

/**
 * Establishes a connection to the MongoDB database.
 *
 * @remarks
 * This function uses the Mongoose library to connect to the MongoDB database
 * specified by the MONGODB_URL environment variable.
 *
 * @returns A Promise that resolves when the database connection is successfully established.
 * @throws Error if the database connection fails.
 */
async function dbConnect(): Promise<void> {
  try {
    // Retrieve the MongoDB connection URL from environment variables
    const dbUrl = env.MONGODB_URL;

    // Configure Mongoose to use strict query mode
    set("strictQuery", true);

    // Connect to the MongoDB database
    await connect(dbUrl, { dbName: "mern_auth" });

    // Log a successful database connection
    log.info("Connected to MongoDB ✅");
  } catch (error) {
    // Handle database connection errors
    log.error(`Failed to connect to MongoDB ❌: ${error}`);

    // Exit the Node.js process with a non-zero status code
    process.exit(1);
  }
}

export { dbConnect };
