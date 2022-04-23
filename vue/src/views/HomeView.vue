<script setup lang="ts">
import { NEmpty, NButton, NSpace } from "naive-ui";
import { useTodoStore } from "@/stores/todo";
import { computed } from "@vue/reactivity";
import TodoList from "../components/todo/TodoList.vue";
import TodoModifyModal from "../components/todo/TodoModifyModal.vue";

const todoStore = useTodoStore();
const { openModal } = todoStore.actions;
const todos = computed(() => todoStore.state.todos);
</script>

<template>
  <main>
    <TodoModifyModal />
    <div v-if="todos.length">
      <n-space :size="30" vertical>
        <n-button @click="openModal()">Create todo</n-button>
        <TodoList :todos="todos" />
      </n-space>
    </div>
    <div v-else>
      <n-empty description="You do not have any todos">
        <template #extra>
          <n-button size="small" @click="openModal()">
            Create a new todo
          </n-button>
        </template>
      </n-empty>
    </div>
  </main>
</template>
