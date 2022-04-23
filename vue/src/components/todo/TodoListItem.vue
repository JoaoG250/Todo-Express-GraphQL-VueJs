<script setup lang="ts">
import {
  NCollapseItem,
  NCheckbox,
  NSpace,
  NButton,
  NPopconfirm,
  useMessage,
} from "naive-ui";
import type { Todo } from "@/models/todo";
import { useTodoStore } from "@/stores/todo";

const props = defineProps<{ todo: Todo }>();
const message = useMessage();
const todoStore = useTodoStore();
const { openModal } = todoStore.actions;

async function handleDelete() {
  await todoStore.actions.deleteTodo(props.todo.id);
  message.success("Todo deleted!");
}
</script>

<template>
  <n-collapse-item :name="todo.id" :title="todo.title">
    <n-space size="large" vertical>
      <div>{{ todo.description }}</div>
      <n-space justify="end">
        <n-button secondary type="info" @click="openModal(todo)">Edit</n-button>
        <n-popconfirm @positive-click="handleDelete">
          <template #trigger>
            <n-button secondary type="error">Delete</n-button>
          </template>
          Are you sure to delete this todo?
        </n-popconfirm>
      </n-space>
    </n-space>
    <template #header-extra>
      <n-checkbox :checked="todo.done" disabled />
    </template>
  </n-collapse-item>
</template>

<style scoped></style>
