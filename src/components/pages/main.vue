<template>
  <div class="container">
    <div class="search-wrap">
      <input
        class="form-control"
        v-model="search.text"
        placeholder="Search..."
      />
    </div>

    <anime-list
      ref="animePlayer"
      v-bind:anime-list="animeList"
    />
  </div>
</template>

<script>
import animeList from "../anime-list";
import api from "../../services/anime-rise";

const animesPerCategory = 12;

export default {
  name: "posts",
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
      search: {
        timeout: null,
        text: "",
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
  watch: {
    "search.text"(searchTerm) {
      clearTimeout(this.search.timeout);

      if (searchTerm.length === 0) {
        return this.setShownAnimeList(this.animeList.new);
      }

      this.search.timeout = setTimeout(async () => {
        const animeList = await api
          .searchAnime(searchTerm)
          .catch(() => this.animeList.new);

        this.setShownAnimeList(animeList);
      }, 200);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.search-wrap {
  background: rgb(var(--color-background-100));
  border-radius: 6px;
  box-shadow: 0 14px 30px rgba(var(--color-shadow-blue), 0.1),
    0 4px 4px rgba(var(--color-shadow-blue), 0.04);
  display: grid;
  font-family: Overpass, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.03rem;
  padding: 6px 12px;
  margin: 10px 0;

  input {
    background: 0 0;
    border: none;
    color: rgb(var(--color-gray-700));
    display: inline-block;
    font-family: Overpass, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    margin: 0;
    outline: 0;
    padding: 0;
    width: 100%;
  }
}

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
