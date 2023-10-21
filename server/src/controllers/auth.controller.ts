import { CookieOptions, Request, Response } from "express";
import { UserService } from "../services/auth.service";
import log from "../utils/logger";
import { JwtStrategy } from "../utils/auth/jwt";
import { randomBytes } from "crypto";
import { sendResetEmail } from "../utils/mailer";
import {
  authenticateUserInput,
  createUserInput,
  forgotPasswordInput,
  resetPasswordInput,
} from "../schemas/user.schema";
import {
  ACCEPTED,
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
  OK,
  UNAUTHORIZED,
} from "http-status";
export class UserController {
  private userService: UserService;
  private jwtStrategy: JwtStrategy;

  constructor() {
    this.userService = new UserService();
    this.jwtStrategy = new JwtStrategy();
  }

  private async setAuthCookies(res: Response, at: string, rt: string) {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      sameSite: "strict",
    };

    res.cookie("access", at, { ...cookieOptions, maxAge: 1 * 60 * 1000 });
    res.cookie("refresh", rt, {
      ...cookieOptions,
      maxAge: 10 * 60 * 60 * 1000,
    });
  }

  private generateOtp(): string {
    return randomBytes(32).toString("hex");
  }
  public async createNewUser(
    req: Request<{}, {}, createUserInput["body"]>,
    res: Response
  ) {
    try {
      const user = await this.userService.createNewUser(req.body);
      const { _id } = user;
      const userId = _id.toString();
      const { at, rt } = await this.jwtStrategy.generateJwt({ sub: userId });
      this.setAuthCookies(res, at, rt);
      return res.status(CREATED).json({ user });
    } catch (error) {
      log.error(error);
      return res.status(FORBIDDEN).send(error);
    }
  }

  public async authenticateUser(
    req: Request<{}, {}, authenticateUserInput["body"]>,
    res: Response
  ) {
    const user = await this.userService.validatePassword(req.body);
    if (!user) {
      return res.status(UNAUTHORIZED).json({ message: "Invalid Credentials" });
    }
    const userId = user._id.toString();
    const { at, rt } = await this.jwtStrategy.generateJwt({ sub: userId });
    this.setAuthCookies(res, at, rt);
    return res.status(ACCEPTED).json({ message: "ok" });
  }

  public getCurrentUser(req: Request, res: Response) {
    return res.send(res.locals.user);
  }

  public async generateAndSendResetToken(
    req: Request<{}, {}, forgotPasswordInput>,
    res: Response
  ) {
    const token = this.generateOtp();
    const { email } = req.body;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return res.status(BAD_REQUEST);
    }
    await this.userService.storeResetToken(user._id, token);
    sendResetEmail(email, token, user._id);
    return res.status(OK).json({ "✅": "Reset link sent" });
  }

  public async resetPassword(
    req: Request<resetPasswordInput["params"], {}, resetPasswordInput["body"]>,
    res: Response
  ) {
    const { userId, token } = req.params;
    const { password } = req.body;
    const user = await this.userService.findUserById(userId);
    if (!user) {
      return res.status(BAD_REQUEST).send("Invalid user");
    }

    const isToken = await this.userService.retrieveResetToken(token, user._id);
    if (!isToken) {
      return res.status(BAD_REQUEST).send("Invalid link or expired");
    }

    try {
      await this.userService.resetPassword(password, user._id);
      return res.status(ACCEPTED).send("Password resetted");
    } catch (error) {
      res.status(FORBIDDEN).send(error);
    }
  }
}
