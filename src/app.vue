<template>
  <div class="navbar-fixed">
    <nav>
      <div class="nav-wrapper container">
        <router-link to="/" class="brand-logo">AnimeRise</router-link>
      </div>
    </nav>
  </div>
  <div class="container">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="scss" rel="stylesheet/scss">
nav {
  background-color: #2b2d42;
  color: #bcbedc;

  .brand-logo {
    font-family: var(--font-family-overpass);
    font-size: 1.8rem;
    font-weight: 600;
  }
}
</style>
