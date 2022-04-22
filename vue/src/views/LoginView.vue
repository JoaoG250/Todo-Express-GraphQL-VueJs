<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { NButton, NInput, NSpace } from "naive-ui";
import { reactive } from "vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const form = reactive({
  email: "",
  password: "",
});

async function handleLogin() {
  const data = {
    email: form.email,
    password: form.password,
  };
  await authStore.actions.login(data);

  await router.push("/");
}
</script>

<template>
  <div>
    <h1>Login View</h1>
    <n-space vertical>
      <n-input
        v-model:value="form.email"
        type="text"
        placeholder="Email"
        :input-props="{ type: 'email' }"
      />
      <n-input
        v-model:value="form.password"
        type="password"
        placeholder="Password"
      />

      <NButton @click="handleLogin">Login</NButton>
      <RouterLink to="/"> Home </RouterLink>
    </n-space>
  </div>
</template>

<style></style>
