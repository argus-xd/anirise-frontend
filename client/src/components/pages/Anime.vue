<template>
  <div>
    <div class="posts">
      <div class="container mb-3">
        <b-form-input v-on:keypress="doSomething" v-model="text" placeholder="Поиск аниме..."></b-form-input>
      </div>
    </div>

    <b-container class="bv-example-row">
      <filter_anime msg="test-pars" @filterTop="filterTop" @lastUpdate="lastUpdate"/>

      <b-row class="text-center">

        <div v-for="(item,index) in mainList.results" v-if="item.material_data" :key="index" class="card col-sm-6 col-md-3" >
          <img v-bind:src="item.material_data.poster_url" class="card-img-top" alt="">
          <div class="card-body" v-if="item.title">
            <h5 class="card-title"> {{ item.title }} </h5>
            <!--<p class="card-text">{{ item.translation.title }}</p>-->
            <!-- <a v-bind:href="/play/++" class="btn btn-primary"></a>-->
            <router-link  class="btn btn-primary"
                         :to="{ name: 'play', params: { shiki_id: item.shikimori_id,name:(item.title_orig.replaceAll(' ', '_')) }}">
              Смотреть
            </router-link>
          </div>
        </div>

      </b-row>


    </b-container>

  </div>

</template>

<style>
.card-img-top {
  height: 300px;
  object-fit: contain;
}
</style>

<script>
import PostsService from '@/services/PostsService'
import filter_anime from '@/components/pages/filter.vue'

export default {
  components: {
    filter_anime
  },
  name: 'posts',
  data() {
    return {
      mainList: function () {
        console.log("asd")

        return arr;
      },
      defaultList: [],
      topShiki: [],
      timer: null,
      text: "",

    }
  },
  async mounted() {

    this.mainList = this.preLoadArr();
    this.defaultList = await this.getMainPageList()
    this.mainList = this.defaultList;


    this.shikiAnimeTop().then(e => {
      e = this.deleteDuplicate(e)
      e = this.sortRatings(e);
      this.topShiki = e;
    })
  },
  methods: {
    async getMainPageList() {
      const response = await PostsService.fetchMainPage()
      return this.deleteDuplicate(response.data) /* */
    },
    async shikiAnimeTop() {
      const response = await PostsService.shikiAnimeTop()
      return response.data
    },
    sortRatings(arr) {
      arr = JSON.parse(JSON.stringify(arr));
      arr.results = arr.results.sort(function (a, b) {
        return b.material_data.shikimori_rating - a.material_data.shikimori_rating
      })
      return arr
    },
    deleteDuplicate(arr) {
      let arrJson = JSON.parse(JSON.stringify(arr.results));
      if (arrJson)
        arr.results = arrJson.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.shikimori_id === thing.shikimori_id
          ))
        )
      return arr
    },
    preLoadArr() {
      let inArr = [];
      for (let i = 0; i < 20; i++) {
        inArr.push({
          'title': "Anime name",
          'title_orig': "test",
          'material_data': {'poster_url': require(`@/assets/preLoader.svg`)}
        })
      }
      return {
        'results': inArr
      };
    },
    search() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        if (this.text !== "") {
          PostsService.fetchSearchName(this.text).then(e => {
            this.mainList = this.deleteDuplicate(e.data);
          })
        } else {
          this.mainList = this.defaultList;
        }
      }, 200);
    },
    filterTop() {
      this.mainList = this.topShiki;
    },
    lastUpdate() {
      this.mainList = this.defaultList;
    },
    doSomething() {
      alert("asd");
    }
  },
  watch: {
    text: function () {
      this.search()
    }
    /*text: async function (val) {
      console.log(val);
      if (val !== "") {
        const response = await PostsService.fetchSearchName(val)
        this.mainList = this.deleteDuplicate(response.data);
      } else
        this.mainList = this.defaultList;
    }*/
  }
}

</script>
