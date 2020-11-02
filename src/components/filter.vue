<template>
  <div class="filter m-1">
    <button type="button" class="btn btn-outline-info" @click="lastUpdate">
      Недавно обновлённые
    </button>
    <button type="button" class="btn btn-outline-info" @click="filterTop">
      Топ
    </button>
  </div>
</template>

<script>
export default {
  name: "filter-anime",
  props: {
    msg: "",
  },
  methods: {
    filterTop() {
      this.$emit("filterTop");
    },
    lastUpdate() {
      this.$emit("lastUpdate");
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
