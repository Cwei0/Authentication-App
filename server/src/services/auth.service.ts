import { omit } from "lodash";
import { ResetCode, User, UserInput } from "../models/users.model";
import {
  authenticateUserInput,
  forgotPasswordInput,
} from "../schemas/user.schema";
import { CustomError } from "../middlewares/errorMiddleware";
import { Types } from "mongoose";
export class UserService {
  private model: typeof User;
  private tokenModel: typeof ResetCode;

  constructor() {
    this.model = User;
    this.tokenModel = ResetCode;
  }

  public async createNewUser(dto: UserInput) {
    try {
      return await this.model.create(dto);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async validatePassword({
    email,
    password,
  }: authenticateUserInput["body"]) {
    const user = await this.model.findOne({ email }).exec();
    if (!user) {
      return false;
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return false;
    }

    return omit(user.toJSON(), "password");
  }

  public async findUserByEmail(email: forgotPasswordInput["email"]) {
    try {
      const user = await this.model.findOne({ email }).exec();
      return user;
    } catch (error) {
      throw new CustomError("User does not exist");
    }
  }

  public async findUserById(id: any) {
    try {
      const user = await this.model.findById(id).exec();
      return user;
    } catch (error) {
      throw new CustomError("User does not exist");
    }
  }

  public async storeResetToken(userId: Types.ObjectId, token: string) {
    try {
      return await this.tokenModel.create({
        userId,
        code: token,
      });
    } catch (error) {
      throw new CustomError("Failed to create token in system");
    }
  }

  public async retrieveResetToken(token: string, userId: Types.ObjectId) {
    try {
      return await this.tokenModel.findOne({
        userId,
        code: token,
      });
    } catch (error) {
      throw new CustomError("Invalid Token");
    }
  }

  public async resetPassword(password: string, userId: Types.ObjectId) {
    try {
      return await this.model.findByIdAndUpdate(userId, { password });
    } catch (error) {}
  }
}
