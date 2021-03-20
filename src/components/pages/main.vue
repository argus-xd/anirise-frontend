<template>
  <div class="container">
    <anime-list v-bind:anime-list="animeList.shown" />
  </div>
</template>

<script>
import animeList from "../anime-list";
import api from "../../services/anime-rise";

const animesPerCategory = 12;

export default {
  name: "main-page",
  components: {
    animeList,
  },
  data() {
    return {
      animeList: {
        shown: Array.from({ length: animesPerCategory }, () => ({
          title: "...",
          poster: require(`@/assets/preLoader.svg`),
        })),
        new: [],
        top: [],
      },
    };
  },
  async mounted() {
    api.animeList(animesPerCategory).then(animes => {
      this.animeList.new = animes;

      this.setShownAnimeList(this.animeList.new);
    });
  },
  methods: {
    setShownAnimeList(animeList) {
      this.animeList.shown = animeList;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.container {
  @media (max-width: 1040px) {
    padding: 0;
  }
  @media (max-width: 1540px) {
    padding-left: 30px;
    padding-right: 30px;
  }
}
</style>
