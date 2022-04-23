import cuid from "cuid";
import config from "config";
import jwt, { JwtPayload } from "jsonwebtoken";
import redisService, { RedisService } from "./redis.service";
import { RequestUser } from "../types";

interface SignJwtArgs {
  payload: JwtPayload;
  subject: string;
  secret: string;
  expiresIn: number;
  jwtid?: string;
}

interface SignTokenArgs {
  payload: JwtPayload;
  subject: string;
  subjectPrefix?: string;
  secret: string;
  expiresIn: number;
  redisDatabase?: number;
}

const jwtConfig: {
  accessTokenSecret: string;
  accessTokenExpiresIn: number;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: number;
} = config.get("jwt");

const redisConfig: {
  defaultDatabase: number;
  refreshTokenDatabase: number;
} = config.get("redis");

export class JwtService {
  private redisService: RedisService;

  constructor() {
    this.redisService = redisService;
  }

  private signJwt({
    payload,
    subject,
    secret,
    expiresIn,
    jwtid,
  }: SignJwtArgs): string {
    const jti = jwtid || cuid();

    return jwt.sign(payload, secret, {
      algorithm: "HS256",
      jwtid: jti,
      subject,
      expiresIn,
    });
  }

  private verifyJwt(token: string, secret: string): JwtPayload | string {
    return jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });
  }

  private async signToken({
    payload,
    subject,
    subjectPrefix = "",
    secret,
    expiresIn,
    redisDatabase = redisConfig.defaultDatabase,
  }: SignTokenArgs): Promise<string> {
    const key = subjectPrefix + subject;
    const jwtid = cuid();

    const token = this.signJwt({
      payload,
      subject,
      secret,
      expiresIn,
      jwtid,
    });

    await this.redisService.setOnDatabase(redisDatabase, key, jwtid, expiresIn);
    return token;
  }

  public signAccessToken(payload: RequestUser, subject: string): string {
    return this.signJwt({
      payload,
      subject,
      secret: jwtConfig.accessTokenSecret,
      expiresIn: jwtConfig.accessTokenExpiresIn,
    });
  }

  public async deleteRefreshTokenFromRedis(subject: string): Promise<number> {
    return this.redisService.deleteFromDatabase(
      redisConfig.refreshTokenDatabase,
      subject
    );
  }

  public async signRefreshToken(
    payload: RequestUser,
    subject: string
  ): Promise<string> {
    return this.signToken({
      payload,
      subject,
      secret: jwtConfig.refreshTokenSecret,
      expiresIn: jwtConfig.refreshTokenExpiresIn,
      redisDatabase: redisConfig.refreshTokenDatabase,
    });
  }

  public verifyRefreshToken(token: string): JwtPayload | string {
    return this.verifyJwt(token, jwtConfig.refreshTokenSecret);
  }
}

const jwtService = new JwtService();
export default jwtService;
