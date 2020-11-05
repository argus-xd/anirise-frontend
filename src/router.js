import { createWebHistory, createRouter } from "vue-router";
import mainPage from "./components/pages/anime";
import animePage from "./components/pages/play";

const routes = [
  {
    path: "/",
    name: "mainPage",
    component: mainPage,
  },
  {
    path: "/animes/:shikimori_id/",
    name: "play",
    component: animePage,
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
