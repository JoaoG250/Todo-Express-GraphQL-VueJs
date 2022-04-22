<script setup lang="ts">
import { NCollapseItem, NCheckbox } from "naive-ui";
import type { Todo } from "@/models/todo";

defineProps<{ todo: Todo }>();
</script>

<template>
  <n-collapse-item :name="todo.id" :title="todo.title">
    <div>{{ todo.description }}</div>
    <template #header-extra>
      <n-checkbox :checked="todo.done" disabled />
    </template>
  </n-collapse-item>
</template>

<style scoped></style>
