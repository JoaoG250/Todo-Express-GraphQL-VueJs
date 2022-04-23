import {
  CREATE_TODO_MUTATION,
  UPDATE_TODO_MUTATION,
  DELETE_TODO_MUTATION,
  type CreateTodoMutationResult,
  type CreateTodoMutationVariables,
  type UpdateTodoMutationResult,
  type UpdateTodoMutationVariables,
  type DeleteTodoMutationResult,
  type DeleteTodoMutationVariables,
} from "@/apollo/mutations/todo";
import {
  TODOS_QUERY,
  type TodosQueryResult,
  type TodosQueryVariables,
} from "@/apollo/queries/todo";
import type { PageInfo } from "@/common/types";
import type { Todo } from "@/models/todo";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { defineStore } from "pinia";
import { reactive, watch } from "vue";
import { useMessage } from "naive-ui";
import { useRoute } from "vue-router";

interface TodoStoreState {
  todos: Todo[];
  pageInfo: PageInfo | undefined;
  modalOpen: boolean;
  modalTodo: Todo | undefined;
}

export const useTodoStore = defineStore("todo", () => {
  const route = useRoute();
  const message = useMessage();
  const state = reactive<TodoStoreState>({
    todos: [],
    pageInfo: undefined,
    modalOpen: false,
    modalTodo: undefined,
  });
  const fetchVariables = reactive<TodosQueryVariables>({
    first: 10,
    filter: undefined,
  });
  const { onResult: onFetchResult, refetch } = useQuery<
    TodosQueryResult,
    TodosQueryVariables
  >(TODOS_QUERY, fetchVariables, { fetchPolicy: "network-only" });

  onFetchResult((result) => {
    state.pageInfo = result.data.todos.pageInfo;
    state.todos = result.data.todos.edges.map((edge) => edge.node);
  });

  watch(
    () => route.query,
    (query) => {
      let filter: { done: boolean } | undefined;
      if (query.done === "true") {
        filter = { done: true };
      } else if (query.done === "false") {
        filter = { done: false };
      }
      fetchVariables.filter = filter;
    },
    { immediate: true }
  );

  async function createTodo(data: CreateTodoMutationVariables["data"]) {
    const { mutate } = useMutation<
      CreateTodoMutationResult,
      CreateTodoMutationVariables
    >(CREATE_TODO_MUTATION, {
      variables: { data },
    });
    const response = await mutate();

    if (!response?.data) {
      message.error("Failed to create todo");
      throw new Error("Create todo failed");
    }

    refetch();
    return response.data.createTodo;
  }

  async function updateTodo(
    id: string,
    data: UpdateTodoMutationVariables["data"]
  ) {
    const { mutate } = useMutation<
      UpdateTodoMutationResult,
      UpdateTodoMutationVariables
    >(UPDATE_TODO_MUTATION, {
      variables: { id, data },
    });
    const response = await mutate();

    if (!response?.data) {
      message.error("Failed to update todo");
      throw new Error("Update todo failed");
    }

    refetch();
    return response.data.updateTodo;
  }

  async function deleteTodo(id: string) {
    const { mutate } = useMutation<
      DeleteTodoMutationResult,
      DeleteTodoMutationVariables
    >(DELETE_TODO_MUTATION, {
      variables: { id },
    });
    const response = await mutate();

    if (!response?.data) {
      message.error("Failed to delete todo");
      throw new Error("Delete todo failed");
    }

    refetch();
    return response.data.deleteTodo;
  }

  function openModal(todo?: Todo) {
    state.modalTodo = todo;
    state.modalOpen = true;
  }

  function closeModal() {
    state.modalOpen = false;
    state.modalTodo = undefined;
  }

  return {
    state,
    actions: {
      createTodo,
      updateTodo,
      deleteTodo,
      openModal,
      closeModal,
    },
  };
});
