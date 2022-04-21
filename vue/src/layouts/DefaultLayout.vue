<script setup lang="ts">
import { h } from "vue";
import { RouterLink, RouterView } from "vue-router";
import type { MenuOption } from "naive-ui";
import { NLayoutHeader, NText, NMenu, NButton } from "naive-ui";

const menuOptions: MenuOption[] = [
  {
    key: "home",
    label: () => h(RouterLink, { to: "/" }, { default: () => "Home" }),
    to: "/",
  },
  {
    key: "login",
    label: () =>
      h(RouterLink, { to: "/auth/login" }, { default: () => "Login" }),
    to: "/auth/login",
  },
];
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
      <RouterLink to="/auth/login">
        <NButton>Login</NButton>
      </RouterLink>
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
