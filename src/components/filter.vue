<template>
  <div class="filter-buttons">
    <a class="waves-effect waves-light btn" @click="filterNew">
      Недавно обновлённые
    </a>
    <a class="waves-effect waves-light btn" @click="filterTop"> Топ </a>
  </div>
</template>

<script>
export default {
  name: "anime-filter",
  methods: {
    filterTop() {
      this.$emit("filter", "top");
    },
    filterNew() {
      this.$emit("filter", "new");
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.filter-buttons {
  .btn {
    background: rgb(var(--color-blue-600));
    &:not(:first-child) {
      margin-left: 10px;
    }
  }
}
</style>
