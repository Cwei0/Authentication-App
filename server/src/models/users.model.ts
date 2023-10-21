import { compare, genSalt, hash } from "bcrypt";
import { Document, Schema, model } from "mongoose";
import { env } from "process";

/**
 * Represents the input data required to create a new user.
 */
interface UserInput {
  name: string;
  email: string;
  password: string;
}

/**
 * Represents a user document in the database.
 */
interface UserDocument extends UserInput, Document {
  createdAt: Date;
  updatedAt: Date;

  /**
   * Compares the provided user password with the stored hashed password.
   * @param userPassword - The user's plain-text password to compare.
   * @returns A promise that resolves to true if the passwords match, or false otherwise.
   */
  comparePassword(userPassword: string): Promise<boolean>;
}

// Define the Mongoose schema for the user
const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Middleware to hash the password before saving it
userSchema.pre("save", async function (next) {
  try {
    let user = this as UserDocument;

    // Only hash the password if it has been modified
    if (!user.isModified("password")) return next();

    // Generate a salt and hash the password
    const salt = await genSalt(Number(env.SALTROUND));
    user.password = await hash(user.password, salt);
    return next();
  } catch (error: any) {
    return next(error); // Pass any error to the next middleware
  }
});

/**
 * Compares the provided user password with the stored hashed password.
 * @param userPassword - The user's plain-text password to compare.
 * @returns A promise that resolves to true if the passwords match, or false otherwise.
 */
userSchema.methods.comparePassword = async function (userPassword: string) {
  const user = this as UserDocument;

  return compare(userPassword, user.password);
};

// Create the User model
const User = model<UserDocument>("User", userSchema);

/**
 * Represents a reset code document stored in the database.
 */
interface ResetCodeDocument extends Document {
  /**
   * The ID of the user associated with this reset code.
   */
  userId: UserDocument["_id"];
  /**
   * The reset code string.
   */
  code: string;
  /**
   * The expiration date and time of the reset code.
   */
  expireAt: Date;
}

/**
 * The Mongoose schema for the ResetCode document.
 */
const resetCodeSchema = new Schema<ResetCodeDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  code: { type: String, required: true },
  expireAt: { type: Date, expires: "10m" },
});

/**
 * The Mongoose model for the ResetCode schema.
 */
const ResetCode = model<ResetCodeDocument>("ResetCode", resetCodeSchema);

export { User, UserDocument, UserInput, ResetCodeDocument, ResetCode };
