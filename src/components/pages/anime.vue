<template>
  <div>
    <div class="posts">
      <div class="container mb-3">
        <input
          class="form-control"
          v-model="search.text"
          placeholder="Поиск аниме..."
        />
      </div>
    </div>

    <div class="bv-example-row container">
      <animeFilter @filter="filter" />

      <div class="anime-list">
        <div
          v-for="(item, index) in this.shownAnimeList"
          :key="index"
          class="card"
        >
          <router-link
            :to="{
              name: 'play',
              params: {
                shiki_id: item.shikimoriId,
                name: item.name,
              },
            }"
          >
            <div
              class="poster"
              :class="posterCover"
              :style="{
                backgroundImage: `url('${item.poster}')`,
              }"
            >
              <img v-bind:src="require(`@/assets/play.svg`)" alt="" />
            </div>
            <div class="card-body" v-if="item.title">
              <div class="card-title">
                {{ item.title }}
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../services/anime-rise";
import animeFilter from "../filter.vue";

export default {
  name: "posts",
  components: {
    animeFilter,
  },
  data() {
    return {
      animeList: {
        shown: Array.from({ length: 20 }, () => ({
          title: "...",
          title_orig: "...",
          material_data: {
            poster_url: require(`@/assets/preLoader.svg`),
          },
        })),
        new: [],
        top: [],
      },
      posterCover: "",
      search: {
        timeout: null,
        text: "",
      },
    };
  },
  async mounted() {
    api.fetchMainPage().then(res => {
      this.posterCover = "poster--cover";
      this.animeList.new = this.deleteDuplicate(res.results || []);

      this.setShownAnimeList(this.animeList.new);
    });

    api.shikiAnimeTop().then(res => {
      res = this.deleteDuplicate(res.results || []);
      res = this.sortByRating(res);
      this.animeList.top = res;
    });
  },
  computed: {
    shownAnimeList() {
      return this.animeList.shown.map(anime => {
        return {
          title: anime.title,
          shikimoriId: anime.shikimori_id || 0,
          name: anime.title_orig.replaceAll(" ", "_"),
          poster: anime.material_data?.poster_url,
        };
      });
    },
  },
  methods: {
    setShownAnimeList(animeList) {
      this.animeList.shown = animeList;
      this.replaceEmptyPosterByShiki(this.animeList.shown);
    },
    deleteDuplicate(animeList) {
      return animeList.filter(
        (anime, index) =>
          index ===
          animeList.findIndex(
            found => found.shikimori_id === anime.shikimori_id,
          ),
      );
    },
    sortByRating(animeList) {
      return animeList.sort((curr, next) => {
        return (
          next.material_data.shikimori_rating -
          curr.material_data.shikimori_rating
        );
      });
    },
    sleep(intervalMs = 1000) {
      return new Promise(resolve => setTimeout(resolve, intervalMs));
    },
    async replaceEmptyPosterByShiki(animeList) {
      for (const item of animeList) {
        if (item.material_data.poster_url.indexOf("no-poster.gif") > 0) {
          await this.sleep(40);
          await api.shikiInfoById(item.shikimori_id).then(({ image }) => {
            item.material_data.poster_url = `https://shikimori.one/${image.original}`;
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
          .fetchSearchName(searchTerm)
          .then(r => this.deleteDuplicate(r.results || []))
          .catch(this.animeList.new);

        this.setShownAnimeList(animeList);
      }, 200);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.card-img-top {
  height: 300px;
  object-fit: contain;
}

.anime-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .card {
    margin-bottom: 1rem;
    box-shadow: 0 0 3rem -1rem rgba(0, 0, 0, 0.5);
    transition: transform 0.1s ease-in-out, box-shadow 0.1s;
    width: 16%;

    &:hover .card-title {
      white-space: unset;
      height: auto;
      word-break: keep-all;
    }

    .poster {
      height: 247px;
      margin: 0 auto;
      position: relative;
      background-repeat: no-repeat;
      background-position: center;
      background-color: #f1f2f3;
      overflow: hidden;

      &--cover {
        background-size: cover;
      }

      &:before {
        content: "";
        position: absolute;
        z-index: 1;
        top: -22px;
        right: -62px;
        margin: 0px auto;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        transform: scale(0, 0);
        transition: all 0.3s ease-in-out;
        width: 300px;
        height: 300px;
      }

      &:hover:before {
        transform: scale(2, 2);
      }
    }

    &-body {
      padding: 0.45rem;
      position: absolute;
      bottom: 0px;
      background: #00000094;
      width: 100%;
      z-index: 2;
    }

    &-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      display: block;
      font-weight: bold;
      line-height: 1.65;
      margin-top: 5px;
      height: 26px;
    }

    a {
      color: white;
      text-decoration: none;
    }

    img {
      width: 32px;
      opacity: 0.5;
      transition: all 0.2s ease;
      bottom: 0;
      left: 0;
      margin: auto;
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
    }

    &:hover svg {
      opacity: 1;
      width: 48px;
    }

    &:hover {
      transform: translateY(-0.5rem) scale(1.0125);
      box-shadow: 0 0.5em 3rem -1rem rgba(0, 0, 0, 0.5);
    }

    @media (max-width: 576px) {
      width: 49%;
    }
  }
}
</style>
