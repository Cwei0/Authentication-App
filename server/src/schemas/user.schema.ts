import { object, string, TypeOf } from "zod";

/**
 * Represents the schema for creating a new user.
 */
const createUserSchema = object({
  body: object({
    /**
     * Represents the user's full name.
     * @remarks Must be a valid entered.
     */
    name: string({ required_error: "Name is required" }),

    /**
     * Represents the user's email address.
     * @remarks Must be a valid email address.
     */
    email: string({ required_error: "Email is required" }).email(
      "Not a valid email"
    ),

    /**
     * Represents the user's password.
     * @remarks Must be at least 6 characters long.
     */
    password: string({ required_error: "Password is required" }).min(
      6,
      "Password is too short - should be 6 chars minimum"
    ),

    /**
     * Represents the confirmation of the user's password.
     * @remarks Must match the password field.
     */
    confirmPassword: string({ required_error: "Confirm Password is required" }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  }),
});

/**
 * Represents the input data type for creating a new user.
 */
type createUserInput = TypeOf<typeof createUserSchema>;

/**
 * Represents the schema for authenticating a user.
 */
const authenticateUserSchema = object({
  body: object({
    /**
     * Represents the user's email address for authentication.
     * @remarks Must be a valid email address format.
     */
    email: string({
      required_error: "The email is required",
    }),

    /**
     * Represents the user's password for authentication.
     * @remarks Must be a valid password.
     */
    password: string({
      required_error: "Password is required",
    }),
  }),
});

/**
 * Represents the input data type for authenticating a user.
 */
type authenticateUserInput = TypeOf<typeof authenticateUserSchema>;

/**
 * Represents the schema for user that wants to reset password.
 */
const forgotPasswordSchema = object({
  /**
   * Represents the user's email address.
   * @remarks Must be a valid email address.
   */
  email: string({ required_error: "Email is required" }).email(
    "Not a valid email"
  ),
});

/**
 * Represents the input data type for authenticating a user forgot password.
 */
type forgotPasswordInput = TypeOf<typeof forgotPasswordSchema>;

export {
  createUserSchema,
  createUserInput,
  authenticateUserSchema,
  authenticateUserInput,
  forgotPasswordSchema,
  forgotPasswordInput,
};
