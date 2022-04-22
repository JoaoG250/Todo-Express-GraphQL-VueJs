<script setup lang="ts">
import { NCollapse } from "naive-ui";
import type { PageInfo } from "@/common/types";
import type { TodoEdge } from "@/models/todo";
import TodoListItem from "./TodoListItem.vue";

defineProps<{
  todos: {
    pageInfo: PageInfo;
    edges: TodoEdge[];
  };
}>();
</script>

<template>
  <n-collapse accordion>
    <template v-for="edge in todos.edges" :key="edge.node">
      <TodoListItem :todo="edge.node" />
    </template>
  </n-collapse>
</template>

<style scoped></style>
