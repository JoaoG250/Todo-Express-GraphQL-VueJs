import config from "config";
import { ApolloServer } from "apollo-server-express";
import express, { NextFunction, Request, Response } from "express";
import { schema } from "./schema";
import { GraphQLContext, ExpressJwtContext } from "./types";
import { expressjwt, UnauthorizedError } from "express-jwt";
import services from "./services";

const accessTokenSecret: string = config.get("jwt.accessTokenSecret");

async function startServer() {
  const app = express();

  app.use(
    expressjwt({
      secret: accessTokenSecret,
      credentialsRequired: false,
      algorithms: ["HS256"],
    }),
    function (
      err: UnauthorizedError,
      _req: Request,
      _res: Response,
      next: NextFunction
    ) {
      if (err.code === "invalid_token") {
        return next();
      }
      return next(err);
    }
  );

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: ExpressJwtContext): GraphQLContext => {
      return {
        user: req.auth,
        ...services,
      };
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000);
  console.log("🚀 Server ready at http://localhost:4000/graphql");
}

startServer();
