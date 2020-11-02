<template>
  <div>
    <div class="posts">
      <div class="container mb-3">
        <input
          class="form-control"
          v-model="text"
          placeholder="Поиск аниме..."
        />
      </div>
    </div>

    <div class="bv-example-row container">
      <animeFilter
        msg="test-pars"
        @filterTop="filterTop"
        @lastUpdate="lastUpdate"
      />

      <div class="anime-list">
        <div v-for="(item, index) in this.animeList" :key="index" class="card">
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
import api from "../../services/PostsService";
import animeFilter from "../filter.vue";

export default {
  components: {
    animeFilter,
  },
  name: "posts",
  computed: {
    animeList() {
      return this.mainList.results.map(anime => {
        return {
          title: anime.title,
          shikimoriId: anime.shikimori_id || 0,
          name: anime.title_orig.replaceAll(" ", "_"),
          poster: anime.material_data?.poster_url,
        };
      });
    },
  },
  data() {
    return {
      mainList: { results: [] },
      objectItem: {},
      defaultList: [],
      topShiki: [],
      timer: null,
      text: "",
      posterCover: "",
      searchText: "", // If value is falsy, reset searchText & searchItem
      getInDB: [
        {
          name: "боруто: новое поколение наруто",
          name_orig: "boruto: naruto next generations",
          year: "2017",
        },
        {
          name: "боруто: новое поколение наруто",
          name_orig: "boruto: naruto next generations",
          year: "2017",
        },
      ],
      item: {},
    };
  },
  async mounted() {
    this.mainList = this.preLoadArr();
    this.defaultList = await api.fetchMainPage().then(e => {
      e = this.deleteDuplicate(e);
      this.posterCover = "poster--cover";
      return e;
    });

    this.mainList = this.defaultList;

    api.shikiAnimeTop().then(e => {
      e = this.deleteDuplicate(e);
      e = this.sortRatings(e);
      this.topShiki = e;
    });

    await this.replaceEmptyPosterByShiki(this.defaultList.results);
    await this.replaceEmptyPosterByShiki(this.topShiki.results);
  },
  methods: {
    sortRatings(arr) {
      arr = JSON.parse(JSON.stringify(arr));
      arr.results = arr.results.sort(function (a, b) {
        return (
          b.material_data.shikimori_rating - a.material_data.shikimori_rating
        );
      });
      return arr;
    },
    deleteDuplicate(arr) {
      let arrJson = JSON.parse(JSON.stringify(arr.results));
      if (arrJson) {
        arr.results = arrJson.filter(
          (thing, index, self) =>
            index ===
            self.findIndex(t => t.shikimori_id === thing.shikimori_id),
        );
      }
      return arr;
    },
    preLoadArr() {
      let inArr = Array.from({ length: 20 }, () => {
        return {
          title: "........................................",
          title_orig: "..",
          material_data: {
            poster_url: require(`@/assets/preLoader.svg`),
          },
        };
      });
      return {
        results: inArr,
      };
    },
    sleep(time) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    },
    async replaceEmptyPosterByShiki(resultsArray) {
      for (const item of resultsArray) {
        if (item.material_data.poster_url.indexOf("no-poster.gif") > 0) {
          await this.sleep(40);
          await api.shikiInfoById(item.shikimori_id).then(shikiItem => {
            item.material_data.poster_url = `https://shikimori.one/${shikiItem.image.original}`;
          });
        }
      }
    },
    search() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        if (this.text !== "") {
          api.fetchSearchName(this.text).then(e => {
            this.mainList = this.deleteDuplicate(e);
          });
        } else {
          this.mainList = this.defaultList;
        }
      }, 200);
    },
    filterTop() {
      this.text = "";
      this.mainList = this.topShiki;
    },
    lastUpdate() {
      this.text = "";
      this.mainList = this.defaultList;
    },
  },
  watch: {
    text: function () {
      this.search();
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
