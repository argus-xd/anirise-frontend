<template>
  <div class="filter m-1">
    <button type="button" class="btn btn-outline-info" @click="filterNew">
      Недавно обновлённые
    </button>
    <button type="button" class="btn btn-outline-info" @click="filterTop">
      Топ
    </button>
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

<style scoped>
.filter {
  display: flex;
}

.filter button,
.filter select {
  margin-right: 1rem;
}
</style>
