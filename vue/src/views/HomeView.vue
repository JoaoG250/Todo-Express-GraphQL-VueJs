<script setup lang="ts">
import { onMounted } from "vue";
import { useTodoStore } from "@/stores/todo";
import { computed } from "@vue/reactivity";
import TodoList from "../components/todo/TodoList.vue";

const todoStore = useTodoStore();
const todos = computed(() => todoStore.state.todos);

onMounted(() => {
  todoStore.actions.fetchTodos();
});
</script>

<template>
  <main>
    <h1>Home View</h1>
    <p v-if="todos.length">
      <TodoList :todos="todos" />
    </p>
  </main>
</template>
