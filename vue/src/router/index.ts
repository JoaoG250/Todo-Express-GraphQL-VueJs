import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/layouts/DefaultLayout.vue"),
      children: [{ path: "", component: () => import("@/views/HomeView.vue") }],
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("@/layouts/AuthLayout.vue"),
      children: [
        { path: "login", component: () => import("@/views/LoginView.vue") },
      ],
    },
  ],
});

export default router;
