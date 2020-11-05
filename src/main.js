import { createApp } from "vue";
import app from "./app.vue";
import router from "./router";

import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import "./assets/styles/default.scss";

createApp(app).use(router).mount("#app");
