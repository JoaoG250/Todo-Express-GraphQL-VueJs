import { Request } from "express";
import { ExpressContext } from "apollo-server-express";

interface RequestUser {
  id: string;
}

interface JwtRequest extends Request {
  user?: RequestUser | undefined;
}

interface GraphQLJwtContext extends ExpressContext {
  req: JwtRequest;
}

interface Context {
  user?: RequestUser | undefined;
}
