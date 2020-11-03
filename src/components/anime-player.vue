<template>
  <div>
    <video
      width="100%"
      preload="metadata"
      ref="video"
      controls="controls"
      poster=" "
    >
      <source v-bind:src="videoSrc + '#t=15.5'" type="video/mp4" />
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
    return {
      videoSrc: "",
    };
  },
  mounted() {},
  watch: {
    playList() {
      if (!this.playList.length) {
        return;
      }

      this.videoSrc = this.playList[this.playList.length - 1].src;
      this.$refs.video.load();
    },
  },
  methods: {},
};
</script>

<style scoped>
video:focus {
  outline: none;
}
</style>
