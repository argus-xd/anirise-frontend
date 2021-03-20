import { createWebHistory, createRouter } from "vue-router";
import main from "./components/pages/main";
import search from "./components/pages/search";
import animeView from "./components/pages/anime/view";

const routes = [
  {
    path: "/",
    name: "main",
    component: main,
  },
  {
    path: "/search/:searchTerm?",
    name: "search",
    component: search,
  },
  {
    path: "/anime/:id/:episode?/:translation?",
    name: "anime:view",
    component: animeView,
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
