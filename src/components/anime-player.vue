<template>
  <div class="player-wrapper" v-bind:class="{ fullscreen }">
    <video
      tabindex="-1"
      preload="none"
      playsinline
      x-webkit-airplay="allow"
      ref="video"
      @play="videoProperties.isPlaying = true"
      @pause="videoProperties.isPlaying = false"
      @timeupdate="videoProperties.currentTime = video.currentTime"
      @durationchange="videoProperties.duration = video.duration"
      @keydown.stop="videoKeyDownEvents"
    ></video>
    <div class="controls" v-if="episode.source" @click.stop="focusVideo">
      <div class="top-controls">
        <a class="dropdown btn" href="#" data-target="translations">{{
          translations.current.translator
        }}</a>
        <div>
          <ul id="translations" class="dropdown-content">
            <li
              v-for="translation in translations.list"
              v-bind:key="translation.id"
            >
              <a
                @click.stop="changeTranslation($event, translation.id)"
                href="javascript: void(0);"
                >{{ translation.translator }}</a
              >
            </li>
          </ul>
          <div>
            episode: {{ episode.current }}<br />
            volume: {{ video.volume * 100 }}<br />
            speed: {{ video.playbackRate }}<br />
            duration: {{ videoProperties.currentTime || 0 }} /
            {{ videoProperties.duration || 0 }}
          </div>
        </div>
      </div>
      <div class="middle-controls">
        <div>
          <div
            class="prev-episode button episode-button"
            @click="$emit('episode-changed', this.episode.current - 1)"
          >
            <span class="fa fa-chevron-left"></span>
          </div>
        </div>
        <div @click.self.stop="changePlayState"></div>
        <div>
          <div
            class="next-episode button episode-button"
            @click="$emit('episode-changed', this.episode.current + 1)"
          >
            <span class="fa fa-chevron-right"></span>
          </div>
        </div>
      </div>
      <div class="bottom-controls">
        <div
          class="play-btn button"
          v-bind:class="{ playing: videoProperties.isPlaying }"
          @click="changePlayState"
        >
          <span class="fa fa-play"></span>
          <span class="fa fa-pause"></span>
        </div>
        <div></div>
        <div>
          <div class="mute button">
            <span class="fa fa-volume-mute"></span>
          </div>
          <div class="expand-btn button" @click.stop="changeFullscreenState">
            <span class="fa fa-expand"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Hls from "hls.js";
import Materialize from "materialize-css";

export default {
  name: "anime-player",
  props: {
    translations: Object,
    episode: Object,
  },
  data() {
    return {
      hls: null,
      video: null,
      fullscreen: false,
      videoProperties: {},
      preventDefaultKeys: [
        "Space",
        "ArrowDown",
        "ArrowUp",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
      ],
    };
  },
  mounted() {
    this.video = this.$refs.video;
    document.addEventListener("fullscreenchange", this.fullscreenListener);
    document.addEventListener("msfullscreenchange", this.fullscreenListener);
    document.addEventListener("mozfullscreenchange", this.fullscreenListener);
    document.addEventListener(
      "webkitfullscreenchange",
      this.fullscreenListener,
    );
  },
  unmounted() {
    document.removeEventListener("fullscreenchange", this.fullscreenListener);
    document.removeEventListener("msfullscreenchange", this.fullscreenListener);
    document.removeEventListener(
      "mozfullscreenchange",
      this.fullscreenListener,
    );
    document.removeEventListener(
      "webkitfullscreenchange",
      this.fullscreenListener,
    );
  },
  updated() {
    const elements = document.querySelectorAll(".dropdown");
    Materialize.Dropdown.init(elements, {
      coverTrigger: false,
      closeOnClick: false,
      constrainWidth: false,
      // alignment: "right",
    });
  },
  methods: {
    fullscreenListener() {
      this.fullscreen = !!document.fullscreenElement;
    },
    changeTranslation(event, translation) {
      for (const node of event.path) {
        if (node.tagName === "UL") {
          const instance = Materialize.Dropdown.getInstance(
            node.previousSibling,
          );
          if (instance.isOpen) {
            instance.close();
          }
          this.$emit("translation-changed", translation);
          break;
        }
      }
    },
    videoKeyDownEvents(event) {
      console.log(event.code);
      if (this.preventDefaultKeys.includes(event.code)) {
        event.preventDefault();
      }

      if (event.code === "Space") {
        this.changePlayState();
      } else if (event.code === "ArrowLeft") {
        let timeMark = this.video.currentTime - 5;
        if (timeMark < 0) {
          timeMark = 0;
        }
        this.video.currentTime = timeMark;
      } else if (event.code === "ArrowRight") {
        let timeMark = this.video.currentTime + 5;
        if (timeMark > this.video.duration) {
          timeMark = this.video.duration;
        }
        this.video.currentTime = timeMark;
      } else if (event.code === "Enter" && event.altKey) {
        this.changeFullscreenState();
      }
    },
    changeFullscreenState() {
      if (this.fullscreen) {
        return this.exitFullScreenMethod.apply(document);
      }

      this.enterFullScreenMethod.apply(this.video);
      this.focusVideo();
    },
    changePlayState() {
      if (this.video.paused) {
        return this.playVideo();
      }
      this.pauseVideo();
    },
    focusVideo() {
      this.video.focus();
    },
    playVideo() {
      if (this.video.paused) this.video.play();
    },
    pauseVideo() {
      if (!this.video.paused) this.video.pause();
    },
  },
  computed: {
    exitFullScreenMethod() {
      return (
        document.exitFullscreen ||
        document.msExitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitCancelFullScreen
      );
    },
    enterFullScreenMethod() {
      return (
        this.video.requestFullscreen ||
        this.video.msRequestFullScreen ||
        this.video.mozRequestFullScreen ||
        this.video.webkitRequestFullscreen ||
        this.video.webkitRequestFullScreen
      );
    },
  },
  watch: {
    episode({ source }) {
      this.pauseVideo();
      if (this.hls) {
        this.hls.destroy();
      }
      this.hls = new Hls();
      this.hls.attachMedia(this.video);
      this.hls.loadSource(source);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
//noinspection ALL
::-webkit-media-controls {
  display: none !important;
}
.player-wrapper {
  position: relative;

  &.fullscreen {
    top: 0 !important;
    left: 0 !important;
    border: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
    z-index: 99999 !important;
  }

  video {
    position: absolute;
    display: block;
    background: #000;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    &:focus {
      outline: none;
    }
  }

  .controls {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: grid;
    grid-template-rows: 44px auto 44px;
    color: rgb(var(--color-gray-500));

    .button {
      cursor: pointer;
      &:hover {
        color: rgb(var(--color-blue));
      }
    }

    .middle-controls {
      display: grid;
      grid-template-columns: 50px auto 50px;

      > div {
        position: relative;
      }

      .episode-button {
        position: absolute;
        width: 50px;
        height: 50px;
        background: red;
        border-radius: 50%;
        text-align: center;
        line-height: 50px;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

        &.prev-episode {
          margin-left: -25px;
        }

        &.next-episode {
          margin-right: -25px;
        }
      }
    }

    .bottom-controls {
      display: grid;
      grid-template-columns: 44px auto 90px;

      .play-btn {
        line-height: 44px;
        text-align: center;
        .fa-pause {
          display: none;
        }

        &.playing {
          .fa-play {
            display: none;
          }
          .fa-pause {
            display: unset;
          }
        }
      }
    }
  }
}
</style>
