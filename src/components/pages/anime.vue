<template>
  <div class="search-wrap">
    <input
      class="form-control"
      v-model="search.text"
      placeholder="Search..."
    />
  </div>

  <animeFilter @filter="filter" />
  <div class="anime-list">
    <router-link
      v-for="(item, index) in this.animeList.shown"
      :key="index"
      class="anime-card"
      :to="{
        name: 'play',
        params: {
          shikimori_id: item.shikimoriId,
        },
      }"
    >
      <div
        class="poster"
        :style="{
          backgroundImage: `url('${item.poster}')`,
        }"
      ></div>
      <div class="title">
        {{ item.title }}
      </div>
    </router-link>
  </div>
</template>

<script>
import api from "../../services/anime-rise";
import animeFilter from "../filter.vue";
import sleep from "../../utils/sleep";

export default {
  name: "posts",
  components: {
    animeFilter,
  },
  data() {
    return {
      animesPerCategory: 12,
      animeList: {
        shown: Array.from({ length: 20 }, () => ({
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
    api.animeList(this.animesPerCategory).then(animes => {
      this.animeList.new = animes;

      this.setShownAnimeList(this.animeList.new);
    });

    this.animeList.top = await api.animeList(this.animesPerCategory, "rating");
  },
  methods: {
    setShownAnimeList(animeList) {
      this.animeList.shown = animeList;
      this.replaceEmptyPosterByShiki(this.animeList.shown);
    },
    async replaceEmptyPosterByShiki(animeList) {
      for (const item of animeList) {
        if (item.poster.indexOf("no-poster.gif") > 0) {
          await sleep(40);
          await api.shikiInfoById(item.shikimoriId).then(({ image }) => {
            item.poster = `https://shikimori.one/${image.original}`;
          });
        }
      }
    },
    filter(filterType) {
      this.search.text = "";

      const showAnimeList = (() => {
        switch (filterType) {
          case "top":
            return this.animeList.top;
        }

        return this.animeList.new;
      })();

      this.setShownAnimeList(showAnimeList);
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

<style lang="scss" rel="stylesheet/scss">
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

.anime-list {
  display: grid;
  grid-gap: 28px 30px;
  grid-template-columns: repeat(auto-fill, 185px);
  justify-content: space-between;
  margin: 30px 0 50px;

  .anime-card {
    animation: in-data-v-758c163c 0.3s linear;
    display: grid;
    grid-template-rows: min-content auto;
    position: relative;
    width: 185px;

    .poster {
      background: rgba(var(--color-background-300), 0.8);
      background-size: contain;
      border-radius: 4px;
      box-shadow: 0 14px 30px rgba(var(--color-shadow-blue), 0.15),
        0 4px 4px rgba(var(--color-shadow-blue), 0.05);
      cursor: pointer;
      display: inline-block;
      height: 265px;
      overflow: hidden;
      position: relative;
      width: 100%;
      z-index: 5;
    }
    .title {
      color: rgb(var(--color-gray-700));
      font-size: 1.4rem;
      font-weight: 600;
      line-height: 21px;
      margin-top: 10px;
      overflow: hidden;
      transition: color 0.2s ease;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
}
</style>
