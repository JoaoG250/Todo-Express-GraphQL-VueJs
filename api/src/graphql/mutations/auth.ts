import { UserInputError } from "apollo-server-express";
import { extendType, stringArg } from "nexus";

export const authMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("login", {
      type: "AuthTokens",
      args: {
        email: stringArg(),
        password: stringArg(),
      },
      async resolve(_root, { email, password }, ctx) {
        const user = await ctx.authService.validateUser(email, password);

        if (!user) {
          throw new UserInputError("Error logging in");
        }

        return ctx.authService.login(user);
      },
    });

    t.field("refreshToken", {
      type: "AuthTokens",
      args: { refreshToken: stringArg() },
      async resolve(_root, { refreshToken }, ctx) {
        return ctx.authService.refreshToken(refreshToken);
      },
    });

    t.field("register", {
      type: "Boolean",
      args: {
        name: stringArg(),
        email: stringArg(),
        password: stringArg(),
      },
      async resolve(_root, { name, email, password }, ctx) {
        return ctx.authService.register(name, email, password);
      },
    });
  },
});
