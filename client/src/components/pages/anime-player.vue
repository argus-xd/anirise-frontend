<template>
  <div>
    <video width="100%"  ref="video" controls poster=" " >
      <source v-bind:src="videoSrc" type="video/mp4">
    </video>

  </div>
</template>

<script>
/*import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'*/

export default {
  name: "anime-player",
  props: {
    playList: '',

  },
  data() {
    return {
      videoSrc: this.playList[this.playList.length-1].src,
    }
  },
  mounted() {
    console.log('this is current player instance object', this.player)
  },
  watch:{
    playList: function (){
      this.videoSrc = this.playList[this.playList.length-1].src;
      let vid = this.$refs.video;
      vid.load();
    },
  },
  methods: {

  }
}
</script>

<style scoped>
video:focus{
  outline: none;
}
</style>
