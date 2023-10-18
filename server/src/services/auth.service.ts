import { omit } from "lodash";
import { User, UserInput } from "../models/users.model";
import { authenticateUserInput } from "../schemas/user.schema";
export class UserService {
  private model: typeof User;

  constructor() {
    this.model = User;
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
}
