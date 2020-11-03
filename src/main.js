import { createApp } from "vue";
import app from "./app.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.css";

createApp(app).use(router).mount("#app");
