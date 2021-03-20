<template>
  <div class="anime-list">
    <router-link
      v-for="(item, index) in this.animeList"
      :key="index"
      class="anime-card"
      :to="{
        name: 'anime:view',
        params: {
          id: item.shikimoriId,
        },
      }"
    >
      <div
        class="poster"
        :style="{
          backgroundImage: `url('${item.poster}')`,
        }"
      ></div>
      <div class="title">
        {{ item.title }}
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "anime-list",
  props: {
    animeList: Object,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.anime-list {
  display: grid;
  grid-gap: 28px 30px;
  grid-template-columns: repeat(auto-fill, 185px);
  justify-content: space-between;
  margin: 30px 0 50px;

  .anime-card {
    animation: in-data-v-758c163c 0.3s linear;
    display: grid;
    grid-template-rows: min-content auto;
    position: relative;
    width: 185px;

    .poster {
      background: rgba(var(--color-background-300), 0.8);
      background-size: cover;
      border-radius: 4px;
      box-shadow: 0 14px 30px rgba(var(--color-shadow-blue), 0.15),
        0 4px 4px rgba(var(--color-shadow-blue), 0.05);
      cursor: pointer;
      display: inline-block;
      height: 265px;
      overflow: hidden;
      position: relative;
      width: 100%;
      z-index: 5;
    }
    .title {
      color: rgb(var(--color-gray-700));
      font-size: 1.4rem;
      font-weight: 600;
      line-height: 21px;
      margin-top: 10px;
      overflow: hidden;
      transition: color 0.2s ease;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
}
</style>
