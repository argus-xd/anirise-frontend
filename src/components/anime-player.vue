<template>
  <div class="player-wrapper">
    <video
      tabindex="-1"
      preload="none"
      playsinline
      x-webkit-airplay="allow"
      ref="video"
      @contextmenu="ev => ev.preventDefault()"
      @keydown.stop="videoKeyDownEvents"
    ></video>
    <div class="controls" v-if="episode.source">
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
        </div>
      </div>
      <div
        class="middle-controls"
        @click.self.stop="
          () => {
            video.focus();
            changePlayState();
          }
        "
      ></div>
      <div class="bottom-controls"></div>
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
      preventDefaultKeys: [
        "Space",
        "ArrowDown",
        "ArrowUp",
        "ArrowLeft",
        "ArrowRight",
      ],
    };
  },
  mounted() {},
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
      if (this.preventDefaultKeys.includes(event.code)) {
        event.preventDefault();
      }

      if (event.code === "Space") {
        this.changePlayState();
      } else if (event.code === "Enter" && event.altKey) {
        this.changeFullscreenState();
      }
    },
    changeFullscreenState() {
      if (document.fullscreenElement) {
        return document.exitFullscreen();
      }
      this.video.requestFullscreen();
    },
    changePlayState() {
      if (this.video.paused) {
        return this.playVideo();
      }
      this.pauseVideo();
    },
    focusVideoElement() {
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
    video() {
      return this.$refs.video;
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
    grid-template-rows: 50px auto 50px;
  }
}
</style>
