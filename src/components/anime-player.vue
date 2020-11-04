<template>
  <div>
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
  methods: {},
};
</script>

<style scoped>
video:focus {
  outline: none;
}
</style>
