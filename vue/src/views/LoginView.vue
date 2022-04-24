<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { NButton, NInput, NSpace, useMessage } from "naive-ui";
import { reactive } from "vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const message = useMessage();
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
  message.success("You have successfully logged in. Welcome back!");
  await router.push({ name: "home:index" });
}
</script>

<template>
  <div>
    <h1>Login</h1>
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
      <n-space justify="center">
        <NButton @click="handleLogin">Login</NButton>
      </n-space>
      <n-space class="footer-links" vertical>
        <span>
          Don't have an account?
          <RouterLink :to="{ name: 'auth:register' }"> Register </RouterLink>
        </span>
        <span>
          Return to
          <RouterLink :to="{ name: 'home:index' }"> Home </RouterLink>
        </span>
      </n-space>
    </n-space>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}

.footer-links {
  text-align: center;
  margin-top: 20px;
}
</style>
