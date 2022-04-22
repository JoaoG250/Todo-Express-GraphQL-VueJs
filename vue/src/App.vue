<script setup lang="ts">
import { RouterView } from "vue-router";
import { darkTheme, NConfigProvider, NGlobalStyle } from "naive-ui";
import { provideApolloClient } from "@vue/apollo-composable";
import apolloClient from "./apollo/client";

provideApolloClient(apolloClient);
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-global-style />
    <RouterView />
  </n-config-provider>
</template>

<style>
@import "@/assets/base.css";
</style>
