import { CookieOptions, Request, Response } from "express";
import { UserService } from "../services/auth.service";
import { authenticateUserInput, createUserInput } from "../schemas/user.schema";
import { ACCEPTED, CREATED, FORBIDDEN, UNAUTHORIZED } from "http-status";
import log from "../utils/logger";
import { JwtStrategy } from "../utils/auth/jwt";
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
}
