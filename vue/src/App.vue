<script setup lang="ts">
import { RouterView } from "vue-router";
import {
  darkTheme,
  NConfigProvider,
  NGlobalStyle,
  NMessageProvider,
} from "naive-ui";
import { provideApolloClient } from "@vue/apollo-composable";
import apolloClient from "./apollo/client";
import { useAuthStore } from "./stores/auth";

provideApolloClient(apolloClient);
useAuthStore();
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-global-style />
    <n-message-provider>
      <RouterView />
    </n-message-provider>
  </n-config-provider>
</template>

<style>
@import "@/assets/base.css";
</style>
