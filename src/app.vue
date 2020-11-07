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
          <p>Complete and completely free anime database with online player.</p>
        </div>
        <div class="col l4 offset-l2 s12">
          <h5>Links</h5>
          <ul>
            <li><a href="#">First</a></li>
            <li><a href="#">Another</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-copyright">
      <div class="container">
        © Powered by Kodik
        <a
          class="right"
          target="_blank"
          href="https://github.com/argus-xd/anirise-frontend"
          >SourceCode</a
        >
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
  margin-top: 64px;
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
  &.transparent {
    background-color: rgba(var(--color-header), 0.8);
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
  background-color: rgb(var(--color-footer));
  color: #bcbedc;
  font-size: 1.8rem;
}
</style>
