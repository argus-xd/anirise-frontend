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
      @enterpictureinpicture="pictureInPictureMode = true"
      @leavepictureinpicture="pictureInPictureMode = false"
    ></video>
    <div class="controls" v-if="episode.source" @click.stop="focusVideo">
      <div class="top-controls">
        <dropdown-select
          v-bind:label="`${translations.selected.translator} [${episodes.from}-${episodes.to}]`"
          v-bind:activeItem="translations.selected.id"
          v-bind:items="dropdownTranslations"
          v-on:item-selected="changeTranslation($event.key)"
        />
        <dropdown-select
          :search-enabled="true"
          v-bind:label="`Эпизод ${episode.number}`"
          v-bind:activeItem="episode.number"
          v-bind:items="dropdownEpisodes"
          v-on:item-selected="requestEpisode($event.index)"
        />
      </div>
      <div class="middle-controls">
        <div
          class="episode-button-wrap"
          @click="previousEpisode"
          :class="{
            disabled: episode.number <= episodes.from,
          }"
        >
          <div class="prev-episode episode-button">
            <span class="fa fa-chevron-left"></span>
          </div>
        </div>
        <div @click="playAreaClickHandler">
          <div
            class="play-state-indicator"
            v-bind:class="{
              playing: playbackInfo.isPlaying,
              'first-playback': playbackInfo.firstPlayback,
              'recently-changed': playbackInfo.playStateRecentlyChanged,
            }"
          >
            <span class="fa fa-play"></span>
            <span class="fa fa-pause"></span>
          </div>
          <div
            v-if="playbackInfo.firstPlayback && lastSeenEpisode"
            class="resume-button"
            @click.stop.self="requestResume"
          >
            Продолжить с {{ lastEpisodeTime }}<br />
            Эпизод {{ lastSeenEpisode.episode }},
            {{
              translations.list.find(
                it => it.id === lastSeenEpisode.translation,
              ).translator
            }}
          </div>
        </div>
        <div
          class="episode-button-wrap"
          @click="nextEpisode"
          :class="{
            disabled: episode.number >= episodes.to,
          }"
        >
          <div class="next-episode episode-button">
            <span class="fa fa-chevron-right"></span>
          </div>
        </div>
      </div>
      <div class="bottom-controls" v-if="!isLoading">
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
          class="picture-btn button one-icon"
          @click="changePictureInPictureState"
          :class="{ active: pictureInPictureMode }"
        >
          <span class="fa fa-clone"></span>
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
import dropdownSelect from "./dropdown-select";
import time from "../utils/time";

const fullScreenEvents = [
  "fullscreenchange",
  "msfullscreenchange",
  "mozfullscreenchange",
  "webkitfullscreenchange",
];

export default {
  name: "anime-player",
  props: {
    translations: Object,
    episode: Object,
    lastSeenEpisode: Object,
  },
  components: { dropdownSelect },
  data() {
    return {
      hls: null,
      video: null,
      fullscreen: false,
      pictureInPictureMode: false,
      timelineHold: false,
      autoplay: false,
      resumeRequested: false,
      mouse: { calm: true, calmTimeout: null, clickTimeout: null },
      playbackInfo: {
        firstPlayback: true,
        progress: 0,
        currentTime: 0,
        playStateRecentlyChanged: false,
      },
      preventDefaultKeys: [
        "Space",
        "ArrowDown",
        "ArrowUp",
        "ArrowLeft",
        "ArrowRight",
        "AltLeft",
        "AltRight",
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

    fullScreenEvents.forEach(eventName =>
      document.addEventListener(eventName, this.fullscreenListener),
    );
  },
  unmounted() {
    document.removeEventListener("mousemove", this.setVideoProgress);

    fullScreenEvents.forEach(eventName =>
      document.removeEventListener(eventName, this.fullscreenListener),
    );
  },
  methods: {
    requestResume() {
      this.resumeRequested = true;
      this.playbackInfo.duration = 0;
      this.$emit("resume-requested");
    },
    playAreaClickHandler({ detail: clicks }) {
      if (clicks === 1) {
        this.mouse.clickTimeout = setTimeout(this.changePlayState, 250);
        return;
      }
      clearTimeout(this.mouse.clickTimeout);
      this.changeFullscreenState();
    },
    fullscreenListener() {
      this.fullscreen = !!document.fullscreenElement;
    },
    calmDisturb() {
      this.mouse.calm = false;
      clearTimeout(this.mouse.calmTimeout);
      this.mouse.calmTimeout = setTimeout(() => (this.mouse.calm = true), 3000);
    },
    previousEpisode() {
      this.requestEpisode(this.episode.index - 1);
    },
    nextEpisode() {
      this.requestEpisode(this.episode.index + 1);
    },
    requestEpisode(index) {
      this.autoplay = true;
      const number = this.episodes.list?.[index] ?? 0;
      this.pauseVideo();
      this.playbackInfo.duration = 0;
      setTimeout(() => this.$emit("episode-changed", number), 50);
    },
    changeTranslation(translation) {
      this.$emit("translation-changed", translation);
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
      this.playbackInfo.firstPlayback = false;
      this.playbackInfo.currentTime = this.video.currentTime;
      this.playbackInfo.progress =
        (this.video.currentTime * 100) / this.video.duration || 0;

      this.$emit("progress-changed", {
        timestamp: this.playbackInfo.currentTime,
        episode: this.episode.number,
        translation: this.translations.selected.id,
      });
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
      if (this.isLoading) return;

      this.playbackInfo.playStateRecentlyChanged = true;
      clearTimeout(this.playbackInfo.playStateRecentlyChangedTimeout);
      this.playbackInfo.playStateRecentlyChangedTimeout = setTimeout(() => {
        this.playbackInfo.playStateRecentlyChanged = false;
      }, 300);

      if (this.video.paused) {
        return this.playVideo();
      }
      this.pauseVideo();
    },
    changePictureInPictureState() {
      if (document.pictureInPictureElement) {
        return document.exitPictureInPicture();
      }

      this.video.requestPictureInPicture();
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
    isLoading() {
      return !this.playbackInfo.duration;
    },
    dropdownTranslations() {
      return this.translations.list.map(it => ({
        key: it.id,
        value: it.translator,
        secondaryValue: `[${it.episodes.from}-${it.episodes.to}]`,
      }));
    },
    dropdownEpisodes() {
      return this.episodes.list.map(it => ({ key: it, value: `Эпизод ${it}` }));
    },
    episodes() {
      return this.translations.selected.episodes;
    },
    elapsedTime() {
      return time.format(this.playbackInfo.currentTime);
    },
    durationTime() {
      return time.format(this.playbackInfo.duration);
    },
    lastEpisodeTime() {
      return time.format(this.lastSeenEpisode.timestamp);
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
    episode({ source }) {
      this.pauseVideo();
      if (this.hls) {
        this.hls.destroy();
      }
      this.hls = new Hls();
      this.hls.attachMedia(this.video);
      this.hls.loadSource(source);

      if (this.autoplay) {
        this.autoplay = false;
        this.playVideo();
      } else if (this.resumeRequested) {
        this.resumeRequested = false;
        this.video.currentTime = this.lastSeenEpisode.timestamp;
        this.playVideo();
      }
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
      &:hover,
      &.one-icon.active {
        color: rgb(var(--color-blue));
      }
    }

    .top-controls {
      z-index: 3;

      .dropdown-select {
        margin-top: 10px;
        margin-left: 10px;
      }
    }

    .middle-controls {
      z-index: 2;
      display: grid;
      grid-template-columns: 60px auto 60px;

      > div {
        position: relative;
      }

      .play-state-indicator {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(51, 51, 51, 0.7);
        color: rgb(var(--color-gray-400));
        text-align: center;
        border-radius: 2px;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        opacity: 0;
        display: none;

        &.first-playback {
          display: block;
          width: 70px;
          height: 70px;
          line-height: 70px;
          opacity: 1;

          .fa-play {
            display: unset !important;
          }
          .fa-pause {
            display: none;
          }

          &:hover {
            background: rgb(51, 51, 51);
          }
        }

        &:not(.playing) {
          .fa-play {
            display: none;
          }
        }

        &.playing {
          .fa-pause {
            display: none;
          }
        }
      }

      .resume-button {
        width: 200px;
        height: 44px;
        line-height: 20px;
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(51, 51, 51, 0.7);
        position: absolute;
        margin: auto;
        left: 0;
        top: 125px;
        right: 0;
        bottom: 0;

        &:hover {
          background: rgb(51, 51, 51);
        }
      }

      .play-state-indicator.recently-changed {
        animation: fadeout 0.5s;
        display: block;
      }

      @keyframes fadeout {
        0% {
          width: 80px;
          height: 80px;
          line-height: 80px;
          opacity: 1;
        }
        100% {
          width: 30px;
          height: 30px;
          line-height: 30px;
          opacity: 0;
        }
      }

      .episode-button-wrap {
        &.disabled {
          pointer-events: none;
          color: dimgray;
        }
      }

      .episode-button-wrap:hover {
        .episode-button {
          background: rgb(51, 51, 51);
        }
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

        &.prev-episode {
          margin-right: 0;
          padding-right: 4px;
        }

        &.next-episode {
          margin-left: 0;
          padding-left: 4px;
        }
      }
    }

    .bottom-controls {
      display: grid;
      grid-template-columns:
        var(--control-dimension) auto var(--control-dimension)
        var(--control-dimension) var(--control-dimension);

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

        &.one-icon {
          .fa {
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
