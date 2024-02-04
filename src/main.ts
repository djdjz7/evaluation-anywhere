import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPersistState from 'pinia-plugin-persistedstate'

import App from "./App.vue";
import router from "./router";

import "virtual:uno.css";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPersistState);
app.use(pinia);
app.use(router);

app.mount("#app");
