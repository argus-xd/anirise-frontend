<template>
  <div>
    <div class="posts">
      <div class="container mb-3">
        <b-form-input v-on:keypress="doSomething" v-model="text" placeholder="Поиск аниме..."></b-form-input>
      </div>
    </div>

    <b-container class="bv-example-row">
      <filter_anime msg="test-pars" @filterTop="filterTop" @lastUpdate="lastUpdate"/>

      <div class="anime-list">

        <div v-for="(item,index) in mainList.results" v-if="item.material_data" :key="index"
             class="card ">
          <router-link
            :to="{ name: 'play', params: { shiki_id: item.shikimori_id,name:(item.title_orig.replaceAll(' ', '_')) }}">
            <div class="poster" :style="{ backgroundImage: `url('${item.material_data.poster_url}')` }">
              <img v-bind:src="require(`@/assets/play.svg`)" alt="">
            </div>
            <!-- <img v-bind:src="item.material_data.poster_url" class="card-img-top" alt="">-->


            <div class="card-body" v-if="item.title">
              <div class="card-title"> {{ item.title }} </div>
              <!--<p class="card-text">{{ item.translation.title }}</p>-->
              <!-- <a v-bind:href="/play/++" class="btn btn-primary"></a>-->


            </div>
          </router-link>
        </div>

      </div>


    </b-container>

  </div>

</template>

<style lang="scss" rel="stylesheet/scss">

.card-img-top {
  height: 300px;
  object-fit: contain;
}

.anime-list {

  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .card {
    margin-bottom: 1rem;
    box-shadow: 0 0 3rem -1rem rgba(0, 0, 0, 0.5);
    transition: transform 0.1s ease-in-out, box-shadow 0.1s;
   /* flex-direction: column-reverse;*/
    width: 16%;

    .poster {
     /* width: 225px;*/
      height: 247px;
      margin: 0 auto;
      position: relative;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
    &-body{
      padding: 0.65rem;
    }
    &-title{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      display: block;
      font-weight: bold;
      line-height: 1.65;
      margin-top: 5px;
    }
    a {
      color: #1d2124;
    }

    img {
      width: 32px;
      opacity: 0.5;
      transition: all 0.2s ease;
      bottom: 0;
      left: 0;
      margin: auto;
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
    }

    &:hover svg {
      opacity: 1;
      width: 48px;
    }
    &:hover {
      transform: translateY(-0.5rem) scale(1.0125);
      box-shadow: 0 0.5em 3rem -1rem rgba(0, 0, 0, 0.5);
    }
  }
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
