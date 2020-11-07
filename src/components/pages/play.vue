<template>
  <div class="container">
    <div class="media row" v-if="animeInfo.material_data">
      <h3>
        {{ animeInfo.title }}
      </h3>
      <div>
        <anime-player v-bind:playList="playList"></anime-player>
        <div class="counter">
          <button
            type="button"
            @click="setEpisode(-1)"
            class="btn btn-outline-primary"
          >
            Предыдущая серия
          </button>
          <button type="button" class="btn btn-outline-secondary">
            {{ episode }} серия
          </button>
          <button
            type="button"
            @click="setEpisode(maxEpisodes, true)"
            class="btn btn-outline-secondary"
          >
            из {{ maxEpisodes }}
          </button>
          <button
            type="button"
            @click="setEpisode(1)"
            class="btn btn-outline-primary"
          >
            Следующая серия
          </button>
        </div>

        <input
          type="range"
          class="custom-range"
          v-on:click="setEpisode(episode, true)"
          v-bind:min="minEpisodes"
          v-bind:max="maxEpisodes"
          id="customRange3"
          v-model="episode"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-md-3 col-sm-12">
        <div class="collection">
          <a
                  v-for="(item, index) in posts.results"
                  :key="index"
                  class="collection-item"
                  v-bind:class="{ active: active_el === item.id }"
                  @click="changeDubbing(item.id)"
          >
            {{ item.translation.title }}
          </a>
        </div>
      </div>
      <div class="col-md-9 col-sm-12">
        <button @click="visible = 1" class="btn m-1 btn-secondary">
          Описание
        </button>
        <button @click="visible = 2" class="btn m-1 btn-secondary">
          Хронология
        </button>
        <a
          :href="'https://shikimori.one' + animeInfoShiki.url"
          target="_blank"
          type="button"
          class="btn btn-primary"
          >Shikimori - info</a
        >
        <div :class="{ hide: visible !== 1 }" id="collapse-1">
          <div
            v-if="animeInfo.material_data"
            v-bind:class="{ hide: desc !== true }"
            class="description"
          >
            <h5 class="mt-0">
              {{ animeInfo.title }} / {{ animeInfo.title_orig }}
            </h5>
            {{ animeInfo.material_data.description }}
            <div><span>Год:</span> {{ animeInfo.material_data.year }}</div>
            <div>
              <span>Рейтин Shikimori:</span>
              {{ animeInfo.material_data.shikimori_rating }}
            </div>
            <div v-if="animeInfo.material_data.anime_genres">
              <span>Жанры:</span>
              {{ animeInfo.material_data.anime_genres.join(", ") }}
            </div>
            <div v-if="animeInfoShiki.next_episode_at">
              <span>Следующий эпизод:</span>
              {{ new Date(animeInfoShiki.next_episode_at).toLocaleString() }}
            </div>
            <div><span>Кол-во эпизодов:</span> {{ animeInfoShiki.episodes }}</div>
            <div><span>Последний эпизод:</span> {{ animeInfo.last_episode }}</div>
            <div>
              <span>Озвучено:</span> {{ minEpisodes + " - " + maxEpisodes }}
            </div>
          </div>
        </div>
        <div :class="{ hide: visible !== 2 }" id="collapse-2">
          <div class="fran-list">
            <div
              v-for="(item, index) in animeFranchise"
              :key="index"
              class="card"
            >
              <div class="row no-gutters">
                <div class="col-md-4">
                  <router-link
                    v-if="item.inBase"
                    :to="{
                      name: 'play',
                      params: {
                        shikimori_id: item.id,
                      },
                    }"
                  >
                    <img
                      v-bind:src="item.image_url.replaceAll('x96', 'original')"
                      class="card-img"
                      alt=""
                    />
                  </router-link>
                  <img
                    v-else
                    v-bind:src="item.image_url.replaceAll('x96', 'original')"
                    class="card-img"
                    alt=""
                  />
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">{{ item.name }}</h5>
                    <p class="card-text">{{ item.year }}</p>
                    <p class="card-text">{{ item.inBase }}</p>
                    <p class="card-text">
                      <small class="text-muted">{{ item.kind }}</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import animePlayer from "../anime-player";
import api from "../../services/anime-rise";

export default {
  name: "posts",
  components: {
    animePlayer,
  },
  data() {
    return {
      posts: [],
      desc: "",
      visible: 1,
      rangeValue: 0,
      active_el: 0,
      episode: 1,
      animeInfo: [],
      animeInfoShiki: [],
      minEpisodes: 0,
      maxEpisodes: 0,
      animeFranchise: [],
      playList: [],
    };
  },
  async mounted() {
    this.desc = localStorage.desc !== "false";
    this.posts = await api.dubbingListByShikiId(
      this.$route.params.shikimori_id,
    );

    if (this.posts.results[0].id) {
      await api
        .fetchGetBySerialId(
          this.$route.query.dubbing || this.posts.results[0].id,
        )
        .then(e => {
          this.animeInfo = e.results[0];
        });

      api
        .shikiInfoById(this.$route.params.shikimori_id)
        .then(res => (this.animeInfoShiki = res));
    } else {
      console.log("Не получен список озвучки");
    }

    this.animeFranchise = await api.shikiFranchise(
      this.$route.params.shikimori_id,
    );
  },
  methods: {
    async setPlayer() {
      const playList = await api.fetchPlayList(
        this.active_el,
        this.animeInfo.last_season,
        this.episode,
      );

      this.playList = Object.entries(playList)
        .map(([size, [video]]) => ({
          size,
          src: video.src
            .replace(":hls:manifest.m3u8", "")
            .replace("//", "https://"),
        }))
        .reverse();
    },
    changeDubbing(el) {
      this.animeEpisodeUpdate();
      this.active_el = el;
      if (this.$route.query.dubbing !== el) {
        api.fetchGetBySerialId(this.active_el).then(e => {
          this.animeInfo = e.results[0];
        });

        this.$router.push({
          name: "play",
          query: { dubbing: this.active_el, episode: this.episode },
        });
      }
    },
    setEpisode(next, goTo = false) {
      next = parseInt(next);
      this.episode = parseInt(this.episode);
      if (
        (this.episode + next <= this.maxEpisodes &&
          this.episode + next >= this.minEpisodes) ||
        goTo
      ) {
        if (goTo) {
          this.episode = next;
        } else {
          this.episode += next;
        }

        this.$router.push({
          name: "play",
          query: { dubbing: this.active_el, episode: this.episode },
        });
        this.setPlayer();
      }
    },
    animeEpisodeUpdate() {
      let season = this.animeInfo.last_season;
      if (this.animeInfo.seasons) {
        let Episodes = this.animeInfo.seasons[season]["episodes"];
        let keysEpisodes = Object.keys(Episodes);
        this.minEpisodes = keysEpisodes[0];
        this.maxEpisodes = keysEpisodes[keysEpisodes.length - 1];
        this.episode = parseInt(keysEpisodes[0]);
      } else {
        this.minEpisodes = 1;
        this.maxEpisodes = 1;
      }

      if (this.$route.query.episode && this.$route.query.dubbing) {
        this.active_el = this.$route.query.dubbing;
        this.episode = parseInt(this.$route.query.episode);
      }

      if (this.episode > this.maxEpisodes) {
        this.episode = this.maxEpisodes;
      } else if (this.episode < this.minEpisodes) {
        this.episode = this.minEpisodes;
      }
    },
  },
  watch: {
    async $route() {
      this.posts = await api.dubbingListByShikiId(
        this.$route.params.shikimori_id,
      );

      this.animeEpisodeUpdate();
    },
    animeInfo: function () {
      this.active_el = this.animeInfo.id;
      this.animeEpisodeUpdate();
      this.setPlayer();
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.card-img-top {
  height: 300px;
  object-fit: contain;
}

.poster {
  width: 100%;
}

.description {
  padding: 0.4rem;
}

.counter {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.media-body span {
  font-weight: bold;
}

.fran-list {
  display: flex;
  flex-wrap: wrap;

  > div {
    width: 50%;
  }
}

@media (max-width: 576px) {
  .counter {
    flex-wrap: wrap;
  }

  .counter button:first-child,
  .counter button:last-child {
    width: 100%;
  }

  .card {
    width: 49%;
  }
}

.anime-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

@media (min-width: 1280px) {
  video {
    width: 809px;
    height: 455px;
  }
}
@media (max-width: 576px) {
  .anime-list {
    width: 49%;
  }
}
</style>
