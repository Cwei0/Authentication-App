import pino from "pino";

/**
 * Pino Logger Configuration Options
 * @typedef {Object} PinoLoggerOptions
 * @property {string} target - The target transport for log output.
 * @property {Object} options - Additional options for the target transport.
 * @property {boolean} options.translateTime - Whether to translate log timestamps to a human-readable format.
 * @property {string} options.ignore - Comma-separated list of properties to ignore in the log output.
 */

// Create a Pino logger instance with specific configuration options
/**
 * Pino Logger Instance
 * @type {pino.Logger}
 */
const log = pino({
  /**
   * Logger Transport Configuration
   * @type {PinoLoggerOptions}
   */
  transport: {
    // Specify the target transport, in this case, "pino-pretty"
    /**
     * Log Output Target
     * @type {string}
     */
    target: "pino-pretty",

    /**
     * Transport Options
     * @type {Object}
     */
    options: {
      // Enable time translation to human-readable format
      /**
       * Translate Time
       * @type {boolean}
       * @description Enables the translation of log timestamps into human-readable format.
       */
      translateTime: true,

      // Specify properties to ignore in the output, in this case, "pid" and "hostname"
      /**
       * Ignored Properties
       * @type {string}
       * @description Comma-separated list of properties to ignore in the log output.
       */
      ignore: "pid,hostname",
    },
  },
});

// Export the Pino logger instance to be used in other parts of the application
/**
 * Exported Pino Logger Instance
 * @type {pino.Logger}
 */
export default log;
