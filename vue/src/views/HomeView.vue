<script setup lang="ts">
import { onMounted } from "vue";
import { NEmpty, NButton, NSpace } from "naive-ui";
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
    <div v-if="todos.length">
      <n-space :size="30" vertical>
        <n-button>Create todo</n-button>
        <TodoList :todos="todos" />
      </n-space>
    </div>
    <div v-else>
      <n-empty description="You do not have any todos">
        <template #extra>
          <n-button size="small"> Create a new todo </n-button>
        </template>
      </n-empty>
    </div>
  </main>
</template>
