import { Request } from "express";
import { ExpressContext } from "apollo-server-express";
import { User } from "@prisma/client";
import { AuthService } from "../services/auth.service";
import { JwtService } from "../services/jwt.service";
import { RedisService } from "../services/redis.service";
import { UserService } from "../services/user.service";
import { TodoService } from "../services/todo.service";

interface RequestUser {
  id: string;
}

interface JwtRequest extends Request {
  auth?: RequestUser | undefined;
}

interface ExpressJwtContext extends ExpressContext {
  req: JwtRequest;
}

interface GraphQLContext {
  redisService: RedisService;
  jwtService: JwtService;
  authService: AuthService;
  userService: UserService;
  todoService: TodoService;
  user?: RequestUser | undefined;
}

type UserWithoutPassword = Omit<User, "password">;

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
