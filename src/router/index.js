import Vue from 'vue'
import Router from 'vue-router'
import Start from '@/components/pages/Start'
import Anime from '@/components/pages/Anime'
import play from "../components/pages/play";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/test',
      name: 'Start',
      component: Start
    },
    {
      path: '/',
      name: 'Anime',
      component: Anime
    },
    {
      path: '/play/:shiki_id/:name/', //:dubbing/:episode/
      name: 'play',
      component: play
    }
  ],
  mode: 'history',
})
