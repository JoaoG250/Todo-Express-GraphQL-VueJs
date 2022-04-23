import { AuthenticationError } from "apollo-server-express";
import { extendType } from "nexus";

export const me = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("me", {
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
  },
});
