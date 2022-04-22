<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import { onMounted, ref } from "vue";
import {
  TODOS_QUERY,
  type TodosQueryResult,
  type TodosQueryVariables,
} from "@/apollo/queries/todo";
import type { PageInfo } from "@/common/types";
import type { TodoEdge } from "@/models/todo";
import TodoList from "../components/todo/TodoList.vue";

const todos = ref<
  | {
      pageInfo: PageInfo;
      edges: TodoEdge[];
    }
  | undefined
>(undefined);

onMounted(() => {
  const { onResult } = useQuery<TodosQueryResult, TodosQueryVariables>(
    TODOS_QUERY,
    { first: 10 }
  );
  onResult((result) => {
    todos.value = result.data.todos;
  });
});
</script>

<template>
  <main>
    <h1>Home View</h1>
    <p v-if="todos">
      <TodoList :todos="todos" />
    </p>
  </main>
</template>
