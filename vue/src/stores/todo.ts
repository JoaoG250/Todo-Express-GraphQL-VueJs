import {
  TODOS_QUERY,
  type TodosQueryResult,
  type TodosQueryVariables,
} from "@/apollo/queries/todo";
import type { PageInfo } from "@/common/types";
import type { Todo } from "@/models/todo";
import { useQuery } from "@vue/apollo-composable";
import { defineStore } from "pinia";
import { reactive } from "vue";

interface TodoStoreState {
  todos: Todo[];
  pageInfo: PageInfo | null;
}

export const useTodoStore = defineStore("todo", () => {
  const state = reactive<TodoStoreState>({
    todos: [],
    pageInfo: null,
  });

  function fetchTodos() {
    const { onResult } = useQuery<TodosQueryResult, TodosQueryVariables>(
      TODOS_QUERY,
      { first: 10 }
    );
    onResult((result) => {
      state.pageInfo = result.data.todos.pageInfo;
      state.todos = result.data.todos.edges.map((edge) => edge.node);
    });
  }

  return {
    state,
    actions: {
      fetchTodos,
    },
  };
});
