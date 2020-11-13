<template>
  <div
    class="player-wrapper"
    v-bind:class="{ fullscreen, calm: mouse.calm && playbackInfo.isPlaying }"
    ref="player"
    @mousemove="calmDisturb"
    @mouseenter="focusVideo"
    @mouseleave="mouse.calm = true"
  >
    <video
      tabindex="-1"
      preload="none"
      playsinline
      x-webkit-airplay="allow"
      ref="video"
      @play="playbackInfo.isPlaying = true"
      @pause="playbackInfo.isPlaying = false"
      @durationchange="this.playbackInfo.duration = this.video.duration"
      @timeupdate="videoProgressHandler"
      @keydown.stop="videoKeyDownEvents"
    ></video>
    <div class="controls" v-if="episode.source" @click.stop="focusVideo">
      <div class="top-controls">
        <a
          class="dropdown translations-dropdown btn"
          href="#"
          data-target="translations"
          >{{ translations.current.translator }}</a
        >
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
      <div class="middle-controls">
        <div>
          <div
            class="prev-episode episode-button"
            :class="{
              disabled: episode.current <= translations.current.episodes.from,
            }"
            @click="requestEpisode(episode.current - 1)"
          >
            <span class="fa fa-chevron-left"></span>
          </div>
        </div>
        <div
          @click.self="changePlayState"
          @dblclick.self="changeFullscreenState"
        ></div>
        <div>
          <div
            class="next-episode episode-button"
            :class="{
              disabled: episode.current >= translations.current.episodes.to,
            }"
            @click="requestEpisode(episode.current + 1)"
          >
            <span class="fa fa-chevron-right"></span>
          </div>
        </div>
      </div>
      <div class="bottom-controls" v-if="playbackInfo.duration">
        <div
          class="play-btn button"
          v-bind:class="{ active: playbackInfo.isPlaying }"
          @click="changePlayState"
        >
          <span class="fa fa-play"></span>
          <span class="fa fa-pause"></span>
        </div>
        <div
          class="timeline"
          ref="timeline"
          @mousedown="
            event => {
              this.timelineHold = true;
              this.setVideoProgress(event);
            }
          "
        >
          <div class="elapsed">{{ elapsedTime }}</div>
          <div class="duration">{{ durationTime }}</div>
          <div
            class="progress"
            :style="{ width: playbackInfo.progress + '%' }"
          ></div>
        </div>
        <div
          class="mute-btn button"
          @click="changeMuteState"
          :class="{ active: !playbackInfo.volume }"
        >
          <span class="fa fa-volume-up"></span>
          <span class="fa fa-volume-mute"></span>
        </div>
        <div
          class="expand-btn button"
          :class="{ active: fullscreen }"
          @click.stop="changeFullscreenState"
        >
          <span class="fa fa-expand"></span>
          <span class="fa fa-compress"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Hls from "hls.js";
import time from "../utils/time";
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
      timelineHold: false,
      mouse: { calm: true, timeout: null },
      playbackInfo: { progress: 0, currentTime: 0 },
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
    this.playbackInfo.volume = this.video.volume;
    document.addEventListener("mouseup", () => (this.timelineHold = false));
    document.addEventListener("mousemove", this.setVideoProgress);
    document.addEventListener("fullscreenchange", this.fullscreenListener);
    document.addEventListener("msfullscreenchange", this.fullscreenListener);
    document.addEventListener("mozfullscreenchange", this.fullscreenListener);
    document.addEventListener(
      "webkitfullscreenchange",
      this.fullscreenListener,
    );
  },
  unmounted() {
    document.removeEventListener("mousemove", this.setVideoProgress);
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
  methods: {
    fullscreenListener() {
      this.fullscreen = !!document.fullscreenElement;
    },
    calmDisturb() {
      this.mouse.calm = false;
      clearTimeout(this.mouse.timeout);
      this.mouse.timeout = setTimeout(() => (this.mouse.calm = true), 3000);
    },
    requestEpisode(episode) {
      this.pauseVideo();
      setTimeout(() => this.$emit("episode-changed", episode), 50);
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
    setVideoProgress(event) {
      if (this.timelineHold) {
        const timelineWidth = this.$refs.timeline.offsetWidth;
        const timelineLeft = this.$refs.timeline.getBoundingClientRect().left;
        const cursorPos = event.clientX - timelineLeft;

        let percentage = (cursorPos * 100) / timelineWidth;

        percentage = percentage > 100 ? 100 : percentage;
        percentage = percentage < 0 ? 0 : percentage;

        this.video.currentTime = (this.video.duration / 100) * percentage;
        this.playbackInfo.progress = percentage;
        this.playbackInfo.currentTime = this.video.currentTime;
      }
    },
    videoProgressHandler() {
      this.playbackInfo.currentTime = this.video.currentTime;
      this.playbackInfo.progress =
        (this.video.currentTime * 100) / this.video.duration;
    },
    videoKeyDownEvents(event) {
      if (this.preventDefaultKeys.includes(event.code)) {
        console.log(event.code);
        event.preventDefault();
        this.calmDisturb();
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
    changeMuteState() {
      this.video.volume = this.video.volume === 1 ? 0 : 1;
      this.playbackInfo.volume = this.video.volume;
    },
    changeFullscreenState() {
      if (this.fullscreen) {
        return this.exitFullScreenMethod.apply(document);
      }

      this.enterFullScreenMethod.apply(this.$refs.player);
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
    elapsedTime() {
      return time.format(this.playbackInfo.currentTime);
    },
    durationTime() {
      return time.format(this.playbackInfo.duration);
    },
    exitFullScreenMethod() {
      return (
        document.exitFullscreen ||
        document.msExitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitCancelFullScreen
      );
    },
    enterFullScreenMethod() {
      const docElement = document.documentElement;
      return (
        docElement.requestFullscreen ||
        docElement.msRequestFullScreen ||
        docElement.mozRequestFullScreen ||
        docElement.webkitRequestFullscreen ||
        docElement.webkitRequestFullScreen
      );
    },
  },
  watch: {
    translations() {
      console.log("translation changed");
      // const elements = document.querySelectorAll(".translations-dropdown");
      // Materialize.Dropdown.init(elements, {
      //   coverTrigger: false,
      //   closeOnClick: false,
      //   constrainWidth: false,
      //   // alignment: "right",
      // });
    },
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
<style>
:root {
  --control-dimension: 44px;
}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
//noinspection ALL
::-webkit-media-controls {
  display: none !important;
}
.player-wrapper {
  position: relative;
  background: #000;
  user-select: none;
  cursor: pointer;

  video {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    &:focus {
      outline: none;
    }
  }

  &.calm {
    cursor: none;
    .controls {
      opacity: 0;
    }
  }

  .controls {
    transition: opacity 0.3s ease-in;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: grid;
    grid-template-rows: var(--control-dimension) auto var(--control-dimension);
    color: rgb(var(--color-gray-400));

    .button {
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
        width: var(--control-dimension);
        height: var(--control-dimension);
        background: rgba(51, 51, 51, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 16px;
        text-align: center;
        line-height: var(--control-dimension);
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

        &.disabled {
          pointer-events: none;
          color: dimgray;
        }

        &:hover {
          background: rgba(51, 51, 51, 1);
        }

        &.prev-episode {
          margin-right: -10px;
          padding-right: 4px;
        }

        &.next-episode {
          margin-left: -10px;
          padding-left: 4px;
        }
      }
    }

    .bottom-controls {
      display: grid;
      grid-template-columns:
        var(--control-dimension) auto var(--control-dimension)
        var(--control-dimension);

      > div {
        height: 100%;
        background: rgba(51, 51, 51, 0.8);
      }

      .button {
        line-height: var(--control-dimension);
        text-align: center;

        .fa:last-child {
          display: none;
        }

        &.active {
          .fa:first-child {
            display: none;
          }
          .fa:last-child {
            display: unset;
          }
        }
      }

      .timeline {
        margin: 0 2px;
        position: relative;

        .elapsed,
        .duration {
          width: 70px;
          position: absolute;
          left: 0;
          height: 100%;
          text-align: right;
          padding-right: 10px;
          line-height: var(--control-dimension);
        }

        .duration {
          left: 70px;
          text-align: left;
          padding-right: 0;
          padding-left: 10px;

          &:before {
            content: "";
            display: block;
            position: absolute;
            height: 14px;
            width: 2px;
            left: -1px;
            top: 0;
            bottom: 0;
            margin: auto;
            background: rgb(var(--color-gray-400));
          }
        }

        .progress {
          min-width: 2px;
          position: absolute;
          height: 100%;
          left: 0;
          top: 0;
          margin: 0;
          border-radius: 0;
          background: rgba(230, 230, 230, 0.3);

          &:after {
            content: "";
            position: absolute;
            width: 2px;
            height: 100%;
            right: 0;
            top: 0;
            background-color: rgba(236, 236, 236, 0.3);
          }
        }
      }
    }
  }
}
</style>
