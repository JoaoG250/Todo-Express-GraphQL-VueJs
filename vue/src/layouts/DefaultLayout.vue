<script setup lang="ts">
import { h } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import type { MenuOption } from "naive-ui";
import { NLayoutHeader, NText, NMenu, NButton } from "naive-ui";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const menuOptions: MenuOption[] = [
  {
    key: "todo",
    label: () =>
      h(
        RouterLink,
        { to: { name: "home:index", query: { done: "false" } } },
        { default: () => "Todo" }
      ),
  },
  {
    key: "done",
    label: () =>
      h(
        RouterLink,
        { to: { name: "home:index", query: { done: "true" } } },
        { default: () => "Done" }
      ),
  },
  {
    key: "all",
    label: () =>
      h(
        RouterLink,
        { to: { name: "home:index" } },
        { default: () => "All todos" }
      ),
  },
];

async function handleLogout() {
  await authStore.actions.logout();
  await router.push({ name: "auth:login" });
}
</script>

<template>
  <n-layout-header>
    <n-text tag="div" class="logo">
      <span>Todo App</span>
    </n-text>
    <div class="nav-menu">
      <n-menu :options="menuOptions" mode="horizontal" />
    </div>
    <div class="nav-end">
      <NButton @click="handleLogout">Logout</NButton>
    </div>
  </n-layout-header>
  <div class="main-container">
    <RouterView />
  </div>
</template>

<style scoped>
.main-container {
  padding: 20px;
}
.n-layout-header {
  --side-padding: 32px;
  --header-height: 64px;
  display: grid;
  grid-template-rows: calc(var(--header-height) - 1px);
  grid-template-columns: 100px 1fr auto;
  align-items: center;
  padding: 0 var(--side-padding);
}
.logo {
  display: flex;
  align-items: center;
  font-size: 18px;
}
.nav-end {
  display: flex;
  align-items: center;
}
.nav-menu {
  display: flex;
}
</style>
