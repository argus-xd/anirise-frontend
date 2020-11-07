<template>
  <div class="player-wrapper">
    <video preload="metadata" ref="video" controls="controls">
      <source
        v-for="video in playList"
        :size="video.size"
        :src="video.src"
        v-bind:key="video"
        type="video/mp4"
      />
    </video>
  </div>
</template>

<script>
export default {
  name: "anime-player",
  props: {
    playList: Array,
  },
  data() {
    return {};
  },
  mounted() {},
  watch: {
    playList() {
      this.$refs.video.load();
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.player-wrapper {
  width: 70%;
  height: 70%;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  video {
    display: block;
    margin: 0 auto;
    background: #000;
    width: 100%;
    height: 100%;
    &:focus {
      outline: none;
    }
  }
}
</style>
