<template>
  <div v-if="anime">
    <div
      class="head-wrap"
      :class="{
        'with-wallpaper': !!anime.banner,
      }"
    >
      <div
        v-if="anime.banner"
        class="anime-wallpaper"
        :style="{
          'background-image': `url('${anime.banner}')`,
        }"
      >
        <div class="shadow"></div>
      </div>
      <div class="head">
        <div class="container">
          <div class="cover">
            <div class="cover-inner">
              <img :src="anime.poster" />
              <div class="actions">
                <a
                  target="_blank"
                  :href="anime.shikimoriUrl"
                  class="action shikimori-link waves-effect"
                  >Shikimori <span class="fa fa-external-link-alt"></span
                ></a>
                <div
                  class="action play waves-effect"
                  @click="showPlayerOverlay"
                >
                  <span class="fa fa-play"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="content">
            <h1>{{ anime.title }} / {{ anime.titleEnglish }}</h1>
            <p class="description">
              {{ anime.description }}
            </p>
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
        v-bind:has-remember-episode="lastSeenEpisode"
        v-on:translation-changed="changeTranslation($event)"
        v-on:episode-changed="setEpisode"
        v-on:progress-changed="rememberEpisodeProgress"
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
        number: Number(this.$route.params.episode) || 1,
        index: 0,
        source: null,
      },
      lastSeenEpisode: null,
      translations: { list: null, selected: null },
      overlayShown: false,
    };
  },
  async mounted() {
    window.addEventListener("keyup", this.keyUpListener);

    const animeId = this.$route.params.id;

    const lastSeenEpisode = localStorage.getItem(`anime-${animeId}:last-seen`);

    if (lastSeenEpisode) {
      this.lastSeenEpisode = JSON.parse(lastSeenEpisode);
    }

    api.animeById(animeId).then(anime => {
      this.anime = anime;

      if (anime.banner) {
        document.querySelector("nav").classList.add("transparency");
      }
    });

    this.loadTranslations(animeId);
  },
  unmounted() {
    document.querySelector("nav").classList.remove("transparency");
    window.removeEventListener("keyup", this.keyUpListener);
  },
  methods: {
    loadTranslations(animeId) {
      api.animeTranslations(animeId).then(translations => {
        this.translations.list = translations;
        this.changeTranslation(this.$route.params.translation);
      });
    },
    changeTranslation(translationId) {
      const translation = this.translations.list.find(
        it => it.id === translationId,
      );

      const replaceRoute = !!this.translations.selected;

      this.translations.selected = translation ?? this.translations.list[0];

      this.setEpisode(this.episode.number, replaceRoute);
    },
    setEpisode(episodeNumber, replaceRoute) {
      episodeNumber = Number(episodeNumber) || 1;
      let episodeIndex = this.translations.selected.episodes.list.findIndex(
        episode => episode === episodeNumber,
      );

      if (episodeIndex < 0) {
        episodeIndex = 0;
        episodeNumber = this.translations.selected.episodes.list[0];
      }

      if (this.episode.number !== episodeNumber || replaceRoute) {
        const params = { episode: episodeNumber };

        if (this.translations.selected.id !== this.translations.list[0].id) {
          params.translation = this.translations.selected.id;
        }

        this.$router.replace({
          name: "anime:view",
          params,
        });
      }

      this.episode = {
        number: episodeNumber,
        index: episodeIndex,
        source: api.episodeSource(episodeNumber, this.translations.selected.id),
      };
    },
    rememberEpisodeProgress(episodeInfo) {
      localStorage.setItem(
        `anime-${this.anime.id}:last-seen`,
        JSON.stringify(episodeInfo),
      );
    },
    keyUpListener(event) {
      if (event.key === "Escape") {
        this.hidePlayerOverlay();
      }
    },
    showPlayerOverlay() {
      this.overlayShown = true;
      this.$refs.animePlayer.focusVideo();
    },
    hidePlayerOverlay() {
      document.activeElement.blur();
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
    .shadow {
      background: linear-gradient(
        180deg,
        rgba(var(--color-shadow-dark), 0) 40%,
        rgba(var(--color-shadow-dark), 0.6)
      );
      height: 100%;
      width: 100%;
    }
  }

  .head {
    background: rgb(var(--color-foreground));
    position: relative;

    .container {
      min-height: 250px;
    }
    .content {
      min-height: 280px;
    }
  }

  &.with-wallpaper {
    .cover {
      margin-top: -110px;

      .cover-inner {
        position: static;
      }
    }
  }

  .cover {
    margin-top: 15px;
    .cover-inner {
      position: absolute;
      img {
        width: 100%;
        display: block;
        border-radius: 2px;
        box-shadow: 0 0 29px rgba(49, 54, 68, 0.25);
      }
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
    min-height: 320px;
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
