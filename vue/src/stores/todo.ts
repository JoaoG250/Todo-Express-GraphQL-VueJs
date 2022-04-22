import type { Todo } from "@/models/todo";
import { defineStore } from "pinia";
import { reactive } from "vue";

interface TodoStoreState {
  todos: Todo[];
}

export const useTodoStore = defineStore("todo", () => {
  const state = reactive<TodoStoreState>({
    todos: [],
  });

  return {
    state,
    getters: {
      todos: () => state.todos,
    },
    actions: {},
  };
});
