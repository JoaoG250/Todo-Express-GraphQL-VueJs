import { ApolloServer } from "apollo-server-express";
import express from "express";
import { schema } from "./schema";

async function startServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    schema,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000);
  console.log("🚀 Server ready at http://localhost:4000/graphql");
}

startServer();
