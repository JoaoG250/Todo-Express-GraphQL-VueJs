import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    loginRequired?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/layouts/DefaultLayout.vue"),
      children: [
        {
          path: "",
          name: "home:index",
          component: () => import("@/views/HomeView.vue"),
        },
      ],
      meta: {
        loginRequired: true,
      },
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("@/layouts/AuthLayout.vue"),
      children: [
        {
          path: "login",
          name: "auth:login",
          component: () => import("@/views/LoginView.vue"),
        },
        {
          path: "register",
          name: "auth:register",
          component: () => import("@/views/RegisterView.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.loginRequired) {
    if (!authStore.getters.loggedIn()) {
      return { name: "auth:login" };
    }
  }
});

export default router;
