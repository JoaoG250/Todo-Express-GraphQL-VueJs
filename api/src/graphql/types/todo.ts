import { inputObjectType, objectType } from "nexus";

export const Todo = objectType({
  name: "Todo",
  definition(t) {
    t.id("id");
    t.string("title");
    t.string("description");
    t.boolean("done");
  },
});

export const FilterTodoInput = inputObjectType({
  name: "FilterTodoInput",
  definition(t) {
    t.boolean("done");
  },
});

export const CreateTodoInput = inputObjectType({
  name: "CreateTodoInput",
  definition(t) {
    t.string("title");
    t.string("description");
  },
});

export const UpdateTodoInput = inputObjectType({
  name: "UpdateTodoInput",
  definition(t) {
    t.string("title");
    t.string("description");
    t.boolean("done");
  },
});
