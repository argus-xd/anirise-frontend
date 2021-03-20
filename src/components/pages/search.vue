<template>
  <div class="container">
    <anime-list v-bind:anime-list="animeList" />
  </div>
</template>

<script>
import animeList from "../anime-list";
import api from "@/services/anime-rise";

const animesPerCategory = 12;

const animeArrayFiller = Array.from({ length: animesPerCategory }, () => ({
  title: "...",
  poster: require(`@/assets/preLoader.svg`),
}));

export default {
  name: "search-page",
  components: {
    animeList,
  },
  data() {
    return {
      animeList: animeArrayFiller,
    };
  },
  mounted() {
    this.search(this.$route.params.searchTerm);
  },
  methods: {
    async search(term) {
      console.log(term);
      if (!term || term.length === 0) {
        this.animeList = await api.animeList(animesPerCategory);
      } else {
        this.animeList = await api.searchAnime(term).catch(() => []);
      }
    },
  },
  watch: {
    "$route.params.searchTerm"(searchTerm) {
      this.search(searchTerm);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
