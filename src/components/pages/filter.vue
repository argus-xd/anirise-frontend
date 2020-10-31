<template>
  <div class="filter m-1">
    <!--    <button type="button" class="btn btn-outline-info" @click="mainList=defaultList">Недавно обновлённые</button>
        <button type="button" class="btn btn-outline-info" @click="mainList=topShiki">Топ</button>-->

    <button type="button" class="btn btn-outline-info" @click="lastUpdate">Недавно обновлённые</button>
    <button type="button" class="btn btn-outline-info" @click="filterTop">Топ</button>


  <!--  <select class="custom-select">
      <option selected>{{ msg }}</option>
      <option value="1">One</option>
      <option value="2">Two</option>
      <option value="3">Three</option>
    </select>-->

  </div>
</template>

<script>
export default {
  name: "filter-anime",
  props: {
    msg: '',
  },
  methods: {
    filterTop() {
      this.$emit('filterTop');
    },
    lastUpdate() {
      this.$emit('lastUpdate');
    }
  }
}
</script>

<style scoped>
.filter {
  display: flex;
}

.filter button, .filter select {
  margin-right: 1rem;
}

.custom-select {
  width: auto;
}
</style>
