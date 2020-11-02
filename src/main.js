import Vue from "vue";
import App from "./App";
import router from "./router";

import "bootstrap/dist/css/bootstrap.css";
import BootstrapVue from "bootstrap-vue";
import VueVideoPlayer from "vue-video-player";

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

Vue.use(VueVideoPlayer);

(() =>
  new Vue({
    el: "#app",
    router,
    components: { App },
    template: "<App/>",
  }))();
