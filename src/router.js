import { createWebHistory, createRouter } from "vue-router";
import main from "./components/pages/main";
import animeView from "./components/pages/anime/view";

const routes = [
  {
    path: "/",
    name: "main",
    component: main,
  },
  {
    path: "/anime/:id/",
    name: "anime:view",
    component: animeView,
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
