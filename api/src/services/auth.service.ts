import bcrypt from "bcrypt";
import config from "config";
import { JwtPayload } from "jsonwebtoken";
import { ForbiddenError } from "apollo-server-express";
import { AuthTokens, RequestUser, UserWithoutPassword } from "../types";
import jwtService, { JwtService } from "./jwt.service";
import redisService, { RedisService } from "./redis.service";
import userService, { UserService } from "./user.service";

const redisRefreshTokenDatabase: number = config.get(
  "redis.refreshTokenDatabase"
);

export class AuthService {
  private userService: UserService;
  private redisService: RedisService;
  private jwtService: JwtService;

  constructor() {
    this.userService = userService;
    this.redisService = redisService;
    this.jwtService = jwtService;
  }

  async validateUser(
    email: string,
    password: string
  ): Promise<UserWithoutPassword | null> {
    const user = await this.userService.user({
      email,
    });

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    const { password: secret, ...result } = user;
    return result;
  }

  async login(user: UserWithoutPassword): Promise<AuthTokens> {
    const payload: RequestUser = { id: user.id };
    return {
      accessToken: this.jwtService.signAccessToken(payload, user.id),
      refreshToken: await this.jwtService.signRefreshToken(payload, user.id),
    };
  }

  async register(name: string, email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 12);
    await this.userService.createUser({
      name: name,
      email: email,
      password: passwordHash,
    });

    return true;
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    let payload: string | JwtPayload;
    try {
      payload = await this.jwtService.verifyRefreshToken(refreshToken);
    } catch (err) {
      throw new ForbiddenError("Invalid refresh token");
    }

    if (typeof payload === "string" || typeof payload.id !== "string") {
      throw new ForbiddenError("Invalid refresh token");
    }

    const check = await this.redisService.checkToken({
      payload,
      database: redisRefreshTokenDatabase,
    });
    if (!check) {
      throw new ForbiddenError("Invalid refresh token");
    }

    const user = await this.userService.user({
      id: payload.id,
    });

    if (!user) {
      throw new ForbiddenError("Invalid refresh token");
    }

    const signPayload = { id: user.id };
    return {
      accessToken: this.jwtService.signAccessToken(signPayload, user.id),
      refreshToken: await this.jwtService.signRefreshToken(
        signPayload,
        user.id
      ),
    };
  }
}

const authService = new AuthService();
export default authService;
