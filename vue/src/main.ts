import { createApp, h } from "vue";
import { createPinia } from "pinia";
import { provideApolloClient } from "@vue/apollo-composable";

import App from "./App.vue";
import router from "./router";
import apolloClient from "./apollo/client";
import { useAuthStore } from "./stores/auth";

const app = createApp({
  setup() {
    provideApolloClient(apolloClient);
    useAuthStore();
  },
  render: () => h(App),
});

app.use(createPinia());
app.use(router);

app.mount("#app");
