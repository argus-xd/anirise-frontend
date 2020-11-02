import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vueVideoPlayer from "vue-video-player";

import "bootstrap/dist/css/bootstrap.css";

createApp(App).use(vueVideoPlayer).use(router).mount("#app");
