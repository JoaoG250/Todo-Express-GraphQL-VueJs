import { createApp, h, provide } from "vue";
import { createPinia } from "pinia";
import { DefaultApolloClient } from "@vue/apollo-composable";

import App from "./App.vue";
import router from "./router";
import apolloClient from "./apollo/client";

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

app.use(createPinia());
app.use(router);

app.mount("#app");
