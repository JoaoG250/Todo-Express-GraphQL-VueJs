import config from "config";
import { ApolloServer } from "apollo-server-express";
import express, { NextFunction, Request, Response } from "express";
import { schema } from "./schema";
import { GraphQLJwtContext } from "./@types";
import { expressjwt, UnauthorizedError } from "express-jwt";

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
    context: ({ req }: GraphQLJwtContext) => {
      return {
        user: req.user,
      };
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000);
  console.log("🚀 Server ready at http://localhost:4000/graphql");
}

startServer();
