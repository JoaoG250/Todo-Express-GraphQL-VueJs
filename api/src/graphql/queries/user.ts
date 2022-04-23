import { AuthenticationError, UserInputError } from "apollo-server-express";
import { extendType, idArg } from "nexus";
import { parsePaginationArgs } from "../../common/relay";

export const userQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("me", {
      type: "User",
      async resolve(_root, _args, ctx) {
        if (!ctx.user) {
          throw new AuthenticationError("You must be logged in");
        }

        const user = await ctx.userService.user({ id: ctx.user.id });

        if (!user) {
          throw new Error("User not found");
        }

        return user;
      },
    });

    t.field("user", {
      type: "User",
      args: {
        id: idArg(),
      },
      async resolve(_root, { id }, ctx) {
        const user = await ctx.userService.user({ id });

        if (!user) {
          throw new UserInputError("User not found");
        }

        return user;
      },
    });

    t.connectionField("users", {
      type: "User",
      nodes(_root, args, ctx) {
        const pagination = parsePaginationArgs(args);
        return ctx.userService.users({ ...pagination });
      },
    });
  },
});
