<script setup lang="ts">
import { NCollapse } from "naive-ui";
import type { Todo } from "@/models/todo";
import TodoListItem from "./TodoListItem.vue";

defineProps<{ todos: Todo[] }>();
</script>

<template>
  <n-collapse accordion>
    <template v-for="todo in todos" :key="todo.id">
      <TodoListItem :todo="todo" />
    </template>
  </n-collapse>
</template>

<style scoped></style>
