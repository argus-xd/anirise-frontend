import { createWebHistory, createRouter } from "vue-router";
import mainPage from "./components/pages/Anime";
import titlePage from "./components/pages/play";

const routes = [
  {
    path: "/",
    name: "MainPage",
    component: mainPage,
  },
  {
    path: "/play/:shiki_id/:name/",
    name: "play",
    component: titlePage,
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
