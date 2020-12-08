<template>
  <nav>
    <div class="nav-wrapper container">
      <router-link to="/" class="brand-logo">AnimeRise</router-link>
    </div>
  </nav>
  <div class="page-content">
    <router-view />
  </div>
  <footer class="page-footer">
    <div class="container">
      <div class="row">
        <div class="col l6 s12">
          <h5>AnimeRise</h5>
          <p>Let's watch together</p>
        </div>
        <div class="col l4 offset-l2 s12">
          <ul>
            <li><a href="#">First Link</a></li>
            <li><a href="#">Another?</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="scss" rel="stylesheet/scss">
#app {
  padding-top: 64px;
  overflow: hidden;
}
nav {
  position: fixed;
  top: 0;
  z-index: 999;
  background-color: rgb(var(--color-header));
  color: #bcbedc;
  transition: background 0.8s ease 0s, top 0.5s ease 0s;

  &.hidden {
    top: -100px;
  }
  &.transparency:not(:hover) {
    background-color: rgba(var(--color-header), 0.5);
  }

  .brand-logo {
    font-family: var(--font-family-overpass);
    font-size: 2.6rem;
    font-weight: 600;
    color: #fff;
  }
}

.page-content {
  min-height: 100vh;
  padding-bottom: 20px;
}

.page-footer {
  padding: 20px 0;
  background-color: rgb(var(--color-footer));
  color: #bcbedc;
  font-size: 1.8rem;
}
</style>
