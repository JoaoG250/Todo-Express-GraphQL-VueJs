import config from "config";
import { JwtPayload } from "jsonwebtoken";
import Redis, { RedisKey, RedisValue } from "ioredis";

interface CheckTokenArgs {
  payload: JwtPayload;
  database: number;
  subjectPrefix?: string;
}

const redisConfig: {
  port: number;
  host: string;
  family: number;
  defaultDatabase: number;
} = config.get("redis");

export class RedisService {
  private redis: Redis;
  private database: number;

  constructor() {
    this.database = redisConfig.defaultDatabase;
    this.redis = new Redis({
      port: redisConfig.port,
      host: redisConfig.host,
      family: redisConfig.family,
      db: redisConfig.defaultDatabase,
    });
  }

  private async selectDatabase(database: number): Promise<"OK"> {
    if (this.database !== database) {
      await this.redis.select(database);
      this.database = database;
      return "OK";
    }
    return "OK";
  }

  public getDatabase(): number {
    return this.database;
  }

  public async set(
    key: RedisKey,
    value: RedisValue,
    expiryTime: number
  ): Promise<"OK" | null> {
    return this.redis.set(key, value, "EX", expiryTime);
  }

  public async get(key: RedisKey): Promise<string | null> {
    return this.redis.get(key);
  }

  public async delete(key: RedisKey): Promise<number> {
    return this.redis.del(key);
  }

  public async setOnDatabase(
    database: number,
    key: RedisKey,
    value: RedisValue,
    expiryTime: number
  ): Promise<"OK" | null> {
    await this.selectDatabase(database);
    return this.set(key, value, expiryTime);
  }

  public async getFromDatabase(
    database: number,
    key: RedisKey
  ): Promise<string | null> {
    await this.selectDatabase(database);
    return this.get(key);
  }

  public async deleteFromDatabase(
    database: number,
    key: RedisKey
  ): Promise<number> {
    await this.selectDatabase(database);
    return this.delete(key);
  }

  public async checkToken({
    payload,
    database,
    subjectPrefix = "",
  }: CheckTokenArgs): Promise<boolean> {
    // Return false if payload does not have jti or sub
    if (!payload.jti || !payload.sub) {
      return false;
    }

    const storedValue = await this.getFromDatabase(
      database,
      subjectPrefix + payload.sub
    );

    // Return false if token is not in redis
    // or if stored value does not match payload jti
    if (storedValue === null || storedValue !== payload.jti) {
      return false;
    }

    return true;
  }
}

const redisService = new RedisService();
export default redisService;
