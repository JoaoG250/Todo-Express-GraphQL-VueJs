<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { NButton, NInput, NSpace, useMessage } from "naive-ui";
import { reactive } from "vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const form = reactive({
  name: "",
  email: "",
  password: "",
});

async function handleRegister() {
  const data = {
    name: form.name,
    email: form.email,
    password: form.password,
  };
  await authStore.actions.register(data);
  message.success("You have successfully registered. Welcome!");
  await router.push({ name: "auth:login" });
}
</script>

<template>
  <div>
    <h1>Register</h1>
    <n-space vertical>
      <n-input v-model:value="form.name" type="text" placeholder="User name" />
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
        <NButton @click="handleRegister">Register</NButton>
      </n-space>
      <n-space class="footer-links" vertical>
        <span>
          Already have an account?
          <RouterLink :to="{ name: 'auth:login' }"> Login </RouterLink>
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
