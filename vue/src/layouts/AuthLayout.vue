<script setup lang="ts">
import { RouterView } from "vue-router";
import { NCard } from "naive-ui";
</script>

<template>
  <div class="main-container">
    <n-card class="auth-card" size="small">
      <RouterView />
    </n-card>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}
.auth-card {
  width: 450px;
}
</style>
