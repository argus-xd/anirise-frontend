<template>
  <div v-if="anime">
    <div class="head-wrap">
      <div class="anime-wallpaper"></div>
      <div class="head">
        <div class="container">
          <div class="cover">
            <img :src="anime.poster" />
            <div class="actions">
              <a
                target="_blank"
                :href="`https://shikimori.one/animes/${anime.id}`"
                class="action shikimori-link waves-effect"
                >Shikimori <span class="fa fa-external-link-alt"></span
              ></a>
              <div class="action play waves-effect" @click="showPlayerOverlay">
                <span class="fa fa-play"></span>
              </div>
            </div>
          </div>
          <div class="content">
            <h1>{{ anime.title }}</h1>
            <p class="description">{{ anime.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="content container"></div>
    <div
      ref="overlay"
      class="player-overlay"
      @click.self="hidePlayerOverlay"
      v-bind:class="{ shown: overlayShown }"
    >
      <anime-player
        ref="animePlayer"
        v-bind:translations="translations"
        v-bind:episode="episode"
      />
    </div>
  </div>
</template>

<script>
import animePlayer from "../../anime-player";
import api from "../../../services/anime-rise";

export default {
  components: {
    animePlayer,
  },
  data() {
    return {
      anime: null,
      episode: {
        current: this.$route.params.episode || 1,
        source: null,
      },
      translations: null,
      overlayShown: false,
    };
  },
  async mounted() {
    window.addEventListener("keyup", this.keyUpListener);

    const { id: animeId, translation } = this.$route.params;

    api.animeById(animeId).then(data => (this.anime = data));

    this.loadTranslations(animeId, translation);
  },
  unmounted() {
    window.removeEventListener("keyup", this.keyUpListener);
  },
  watch: {
    translations() {
      this.setEpisode(this.episode.current);
    },
  },
  methods: {
    loadTranslations(animeId, translation) {
      api
        .animeTranslations(animeId, translation)
        .then(data => (this.translations = data));
    },
    setEpisode(episode) {
      episode = Number(episode) || 1;

      if (this.translations) {
        const {
          current: { episodes },
        } = this.translations;

        if (episodes.from > episode) episode = episodes.from;
        else if (episodes.to < episode) episode = episodes.to;
      }

      this.episode = {
        current: episode,
        source: api.episodeSource(episode, this.translations.current.id),
      };
    },
    keyUpListener(event) {
      if (event.key === "Escape") {
        this.hidePlayerOverlay();
      }
    },
    showPlayerOverlay() {
      this.overlayShown = true;
      this.$refs.animePlayer.focusVideoElement();
    },
    hidePlayerOverlay() {
      this.overlayShown = false;
      this.$refs.animePlayer.pauseVideo();
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.head-wrap {
  position: relative;
  z-index: 998;
  .anime-wallpaper {
    background-position: 50% 34%;
    background-repeat: no-repeat;
    background-size: cover;
    height: 400px;
    margin-top: -64px;
    background-image: url("https://w.wallhaven.cc/full/lq/wallhaven-lq51ll.png");
  }

  .head {
    background: rgb(var(--color-foreground));
    position: relative;
    .container {
      min-height: 250px;
    }
  }

  .cover {
    margin-top: -110px;
    img {
      width: 100%;
      display: block;
      border-radius: 2px;
      box-shadow: 0 0 29px rgba(49, 54, 68, 0.25);
    }
  }

  .actions {
    display: grid;
    grid-template-columns: auto 35px;
    margin-bottom: 20px;
    margin-top: 20px;
    grid-gap: 15px;

    .action {
      cursor: pointer;
      display: flex;
      border-radius: 3px;
      font-size: 1.4rem;
      height: 35px;
      align-items: center;
      justify-content: center;
      transition: 0.2s;
      color: rgb(var(--color-white));

      &.shikimori-link {
        background: rgb(var(--color-blue));
        .fa {
          margin-left: 10px;
          font-size: 1rem;
        }
      }
      &.play {
        background: rgb(var(--color-red));
      }

      .fa {
        font-size: 1.2rem;
      }

      &:hover {
        box-shadow: 0 0 10px rgba(49, 54, 68, 0.45);
      }
    }
  }
}

.player-overlay {
  position: fixed;
  background: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100%;
  min-height: 320px;
  top: 0;
  opacity: 0;
  z-index: 1001;
  pointer-events: none;
  transition: opacity 0.4s ease 0s;
  &.shown {
    opacity: 1;
    pointer-events: all;
  }
  .player-wrapper {
    width: 70%;
    height: 70%;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
}

.content {
  display: inline-grid;
  grid-template-rows: min-content min-content auto;
  padding-top: 25px;
}

.container {
  display: grid;
  grid-column-gap: 30px;
  grid-template-columns: 215px auto;
}

.description {
  color: rgb(var(--color-text-light));
  font-size: 1.4rem;
  line-height: 1.5;
  margin: 0;
  max-width: 900px;
  padding: 15px 0;
  transition: 0.2s;
}
</style>
