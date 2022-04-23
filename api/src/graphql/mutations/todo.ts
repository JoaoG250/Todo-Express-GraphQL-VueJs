import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from "apollo-server-express";
import { arg, extendType, idArg } from "nexus";

export const todoMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createTodo", {
      type: "Todo",
      args: {
        data: arg({ type: "CreateTodoInput" }),
      },
      async resolve(_root, { data }, ctx) {
        if (!ctx.user) {
          throw new AuthenticationError("You must be logged in");
        }

        return ctx.todoService.createTodo({
          user: { connect: { id: ctx.user.id } },
          ...data,
        });
      },
    });

    t.field("updateTodo", {
      type: "Todo",
      args: {
        id: idArg(),
        data: arg({ type: "UpdateTodoInput" }),
      },
      async resolve(_root, { id, data }, ctx) {
        if (!ctx.user) {
          throw new AuthenticationError("You must be logged in");
        }

        const todo = await ctx.todoService.todo({ id });

        if (!todo) {
          throw new UserInputError("Todo not found");
        }

        if (todo.userId !== ctx.user.id) {
          throw new ForbiddenError("You are not allowed to update this todo");
        }

        return ctx.todoService.updateTodo({
          where: { id },
          data,
        });
      },
    });

    t.field("deleteTodo", {
      type: "Todo",
      args: { id: idArg() },
      async resolve(_root, { id }, ctx) {
        if (!ctx.user) {
          throw new AuthenticationError("You must be logged in");
        }

        const todo = await ctx.todoService.todo({ id });

        if (!todo) {
          throw new UserInputError("Todo not found");
        }

        if (todo.userId !== ctx.user.id) {
          throw new ForbiddenError("You are not allowed to delete this todo");
        }

        return ctx.todoService.deleteTodo({ id });
      },
    });
  },
});
