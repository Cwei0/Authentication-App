import {
  JsonWebTokenError,
  JwtPayload,
  SignOptions,
  TokenExpiredError,
  sign,
  verify,
} from "jsonwebtoken";
import { env } from "process";

/**
 * Custom error class for refresh token expiration or invalidity.
 */
class TokenExpiredOrInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenExpiredOrInvalidError";
  }
}

/**
 * Represents a custom JWT payload extending the standard JwtPayload
 */
interface customJwtPayloads extends JwtPayload {}

/**
 * Represents a JWT token verification result.
 */
type JwtVerificationResult =
  | {
      status: "valid";
      expired: boolean;
      decoded: string | customJwtPayloads;
    }
  | { status: "invalid"; expired: boolean; decoded: null };

/**
 * A class that handles JWT token generation and verification.
 */
class JwtStrategy {
  private readonly secretKey: string;

  /**
   * Creates an instance of JwtStrategy.
   * @param {string} secretKey - The JWT secret key.
   */
  constructor() {
    this.secretKey = env.PRIV_KEY_A;
  }

  /**
   * Generates a pair of JWT tokens (access token and refresh token).
   * @param {Object} obj - The payload to be encoded in the tokens.
   * @param {SignOptions | undefined} options - Optional JWT signing options.
   * @returns {Promise<{ at: string, rt: string }>} The generated tokens.
   */
  public async generateJwt(
    object: Object,
    options?: SignOptions
  ): Promise<{ at: string; rt: string }> {
    const [at, rt] = await Promise.all([
      sign(object, this.secretKey, {
        ...(options && options),
        expiresIn: "1m",
      }),
      sign(object, this.secretKey, {
        ...(options && options),
        expiresIn: "10m",
      }),
    ]);

    return { at, rt };
  }

  /**
   * Verifies a JWT token and returns the verification result.
   * @param {string} token - The JWT token to verify.
   * @returns {JwtVerificationResult} The verification result.
   */
  public async verifyJwt(token: string): Promise<JwtVerificationResult> {
    try {
      var decoded = verify(token, this.secretKey);
      return { status: "valid", expired: false, decoded };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return {
          status: "invalid",
          expired: error.message === "jwt expired",
          decoded: null,
        };
      } else if (error instanceof JsonWebTokenError) {
        return {
          status: "invalid",
          expired: error.message === "jwt malformed",
          decoded: null,
        };
      }

      // Handle other verification errors
      throw new Error("Token verification failed");
    }
  }

  /**
   * Renews a JWT token (access) based on the provided refresh token, also checks the validity of the refresh token.
   * @param {string} token - The JWT token
   * @returns {Promise<string>} The new JWT token or thrown errors
   */
  public async renewToken(token: string): Promise<string> {
    const { status, decoded } = await this.verifyJwt(token);
    if (status === "invalid") {
      throw new TokenExpiredOrInvalidError(
        "Refresh token is invalid or has expired. Please reauthenticate."
      );
    }
    if (status === "valid" && decoded && decoded.sub) {
      const newToken = sign({ sub: decoded.sub }, this.secretKey, {
        expiresIn: "1m",
      });
      return newToken;
    }
    throw new TokenExpiredOrInvalidError("Token renewal failed");
  }
}

export { JwtStrategy, JwtVerificationResult };
