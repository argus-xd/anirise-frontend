<template>
  <nav>
    <div class="nav-wrapper container">
      <router-link to="/" class="brand-logo">AnimeRise</router-link>
      <div class="search-wrap">
        <div
          ref="searchPlate"
          class="search-plate"
          :class="{
            focused: search.focused,
          }"
        >
          <input
            class="form-control"
            v-model="search.text"
            v-on:focus="search.focused = true"
            v-on:blur="search.focused = false"
            placeholder="Search..."
          />
        </div>
      </div>
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
  data() {
    return {
      search: {
        timeout: null,
        text: "",
      },
    };
  },
  watch: {
    "search.text"(searchTerm) {
      clearTimeout(this.search.timeout);

      this.search.timeout = setTimeout(async () => {
        this.$router.push({ name: "search", params: { searchTerm } });
      }, 200);
    },
  },
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

  .nav-wrapper {
    display: grid;
    grid-template-columns: 130px auto;
    grid-gap: 15px;
  }

  .brand-logo {
    position: static;
    font-family: var(--font-family-overpass);
    font-size: 2.6rem;
    font-weight: 600;
    color: #fff;
    text-align: center;
  }

  .search-wrap {
    display: flex;
    flex-direction: row-reverse;
  }

  .search-plate {
    background: rgb(var(--color-background-100));
    border-radius: 6px;
    box-shadow: 0 14px 30px rgba(var(--color-shadow-blue), 0.1),
      0 4px 4px rgba(var(--color-shadow-blue), 0.04);
    display: grid;
    font-family: Overpass, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-size: 1.3rem;
    font-weight: 600;
    letter-spacing: 0.03rem;
    padding: 6px 12px;
    margin: 10px 0;
    max-width: 700px;
    width: 200px;
    transition: width 0.5s;

    &.focused {
      width: 80%;
    }

    input {
      background: 0 0;
      border: none;
      color: rgb(var(--color-gray-700));
      display: inline-block;
      font-family: Overpass, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen,
        Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      margin: 0;
      outline: 0;
      padding: 0;
      width: 100%;
    }
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
