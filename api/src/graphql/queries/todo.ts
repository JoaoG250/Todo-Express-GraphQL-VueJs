import { Prisma } from "@prisma/client";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { arg, extendType, idArg, nullable } from "nexus";
import { parsePaginationArgs } from "../../common/relay";

export const todoQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("todo", {
      type: "Todo",
      args: {
        id: idArg(),
      },
      async resolve(_root, { id }, ctx) {
        const todo = await ctx.todoService.todo({ id });

        if (!todo) {
          throw new UserInputError("Todo not found");
        }

        return todo;
      },
    });

    t.connectionField("todos", {
      type: "Todo",
      additionalArgs: {
        filter: nullable(arg({ type: "FilterTodoInput" })),
      },
      nodes(_root, args, ctx) {
        const pagination = parsePaginationArgs(args);

        if (!ctx.user) {
          throw new AuthenticationError("You must be logged in");
        }

        const where: Prisma.TodoWhereInput = { userId: ctx.user.id };

        if (args.filter) {
          where.done = args.filter.done;
        }

        return ctx.todoService.todos({
          where,
          orderBy: [{ done: "asc" }, { createdAt: "asc" }],
          ...pagination,
        });
      },
    });
  },
});
