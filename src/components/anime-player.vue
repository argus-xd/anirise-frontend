<template>
  <video preload="metadata" ref="video" controls="controls">
    <source
      v-for="video in playList"
      :size="video.size"
      :src="video.src"
      v-bind:key="video"
      type="video/mp4"
    />
  </video>
</template>

<script>
export default {
  name: "anime-player",
  props: {
    playList: Array,
  },
  data() {
    return {
      videoSrc: "",
    };
  },
  mounted() {},
  watch: {
    playList() {
      this.$refs.video.load();
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
video {
  display: block;
  margin: 0 auto;
  background: #000;
  &:focus {
    outline: none;
  }
}
</style>
