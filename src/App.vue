<template>
  <div id="app">
    <div class="container-fluid">
      <h1>
        <router-link to="/">AnimeRise</router-link>
      </h1>
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  margin-top: 60px;
  /*  background-image: url("https://sun9-9.userapi.com/c638526/v638526084/99fc/J2g1KtXFi6c.jpg");*/
}
</style>
