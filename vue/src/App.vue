<script setup lang="ts">
import { RouterView } from "vue-router";
import {
  darkTheme,
  NConfigProvider,
  NGlobalStyle,
  NMessageProvider,
} from "naive-ui";
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
