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
nav {
  background-color: #2b2d42;
  color: #bcbedc;

  .brand-logo {
    font-family: var(--font-family-overpass);
    font-size: 2.6rem;
    font-weight: 600;
    color: #fff;
  }
}

.page-footer {
  background-color: #2b2d42;
  color: #bcbedc;
  font-size: 1.8rem;
}
</style>
