<template>
  <div>
    <div class="posts">
      <div class="container mb-3">
        <b-form-input v-on:keypress="doSomething" v-model="text" placeholder="Поиск аниме..."></b-form-input>
      </div>
    </div>

    <b-container class="bv-example-row">

      <!-- <model-list-select :list="getInDB"
                          v-model="objectItem"
                          option-value="name"
                          option-text="name"
                          @searchchange="searchchange"
                          :custom-text="codeAndNameAndDesc"
                          placeholder="select item">
       </model-list-select>-->
      <filter_anime msg="test-pars" @filterTop="filterTop" @lastUpdate="lastUpdate"/>

      <div class="anime-list">

        <div v-for="(item,index) in mainList.results" v-if="item.material_data" :key="index"
             class="card ">
          <router-link
            :to="{ name: 'play', params: { shiki_id: item.shikimori_id,name:(item.title_orig.replaceAll(' ', '_')) }}">
            <div class="poster" :class="posterCover"
                 :style="{ backgroundImage: `url('${item.material_data.poster_url}')` }">
              <img v-bind:src="require(`@/assets/play.svg`)" alt="">
            </div>
            <div class="card-body" v-if="item.title">
              <div class="card-title"> {{ item.title }}</div>
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
    /*  display: grid;
      grid-template-columns: repeat(auto-fill, 16%);
      grid-gap: 0rem;*/

    justify-content: space-between;

    /*&::after {
      content: "";
      flex: auto;
    }*/
    .card {
      margin-bottom: 1rem;
      box-shadow: 0 0 3rem -1rem rgba(0, 0, 0, 0.5);
      transition: transform 0.1s ease-in-out, box-shadow 0.1s;
      /* flex-direction: column-reverse;*/
      width: 16%;

      &:hover .card-title {
        white-space: unset;
        height: auto;
        word-break: keep-all; /*word-break: break-all;*/
      }

      .poster {
        height: 247px;
        margin: 0 auto;
        position: relative;
        background-repeat: no-repeat;
        background-position: center;
        background-color: #f1f2f3;
        overflow: hidden;

        &--cover {
          background-size: cover;
        }

        &:before {
          content: "";
          position: absolute;
          z-index: 1;
          top: -22px;
          right: -62px;
          margin: 0px auto;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 50%;
          transform: scale(0, 0);
          transition: all 0.3s ease-in-out;
          width: 300px;
          height: 300px;
        }

        &:hover:before, {
          transform: scale(2, 2);
        }
      }

      &-body {
        padding: 0.45rem;
        position: absolute;
        bottom: 0px;
        background: #00000094;
        width: 100%;
        z-index: 2;
      }

      &-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        display: block;
        font-weight: bold;
        line-height: 1.65;
        margin-top: 5px;
        height: 26px;

      }

      a {
        color: white;
        text-decoration: none
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

      @media (max-width: 576px) {

        width: 49%;

      }

    }
  }

</style>

<script>
/* eslint-disable */
  import PostsService from '@/services/PostsService'
  import filter_anime from '@/components/pages/filter.vue'
  import 'vue-search-select/dist/VueSearchSelect.css'
  import {ModelListSelect} from 'vue-search-select'
  import _ from 'lodash'

  export default {
    components: {
      filter_anime,
      ModelListSelect
    },
    name: 'posts',
    data () {
      return {
        mainList: function () {
          console.log('asd')
          return arr
        },
        objectItem: {},
        defaultList: [],
        topShiki: [],
        timer: null,
        text: '',
        posterCover: '',
        searchText: '', // If value is falsy, reset searchText & searchItem
        getInDB: [
          {name: 'боруто: новое поколение наруто', name_orig: 'boruto: naruto next generations', year: '2017'},
          {name: 'боруто: новое поколение наруто', name_orig: 'boruto: naruto next generations', year: '2017'}
        ],
        item: {}

      }
    },
    async mounted () {
      this.mainList = this.preLoadArr()
      this.defaultList = await this.getMainPageList().then(e => {
        this.posterCover = 'poster--cover'
        return e
      })
      this.mainList = this.defaultList

      this.shikiAnimeTop().then(e => {
        e = this.deleteDuplicate(e)
        e = this.sortRatings(e)
        this.topShiki = e
      })

      await this.replaceEmptyPosterByShiki(this.defaultList.results)
      await this.replaceEmptyPosterByShiki(this.topShiki.results)
    },
    methods: {
      async searchInDB (name) {
        const response = await PostsService.searchInDB(name)
        return response.data
      },
      async getInfoShiki (id) {
        const response = await PostsService.shikiAnime(id)
        return response.data
      },
      async getMainPageList () {
        const response = await PostsService.fetchMainPage()
        return this.deleteDuplicate(response.data) /* */
      },
      async shikiAnimeTop () {
        const response = await PostsService.shikiAnimeTop()
        return response.data
      },
      sortRatings (arr) {
        arr = JSON.parse(JSON.stringify(arr))
        arr.results = arr.results.sort(function (a, b) {
          return b.material_data.shikimori_rating - a.material_data.shikimori_rating
        })
        return arr
      },
      deleteDuplicate (arr) {
        let arrJson = JSON.parse(JSON.stringify(arr.results))
        if (arrJson) {
          arr.results = arrJson.filter((thing, index, self) =>
            index === self.findIndex((t) => (
              t.shikimori_id === thing.shikimori_id
            ))
          )
        }
        return arr
      },
      preLoadArr () {

        let inArr = Array.from({length: 20}, () => {
          return {
            'title': '........................................',
            'title_orig': '',
            'material_data': {'poster_url': require(`@/assets/preLoader.svg`)}
          }

        })
        return {
          'results': inArr
        }
      },
      sleep (time) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, time)
        })
      },
      async replaceEmptyPosterByShiki (resultsArray) {
        for (const item of resultsArray) {
          if (item.material_data.poster_url.indexOf('no-poster.gif') > 0) {
            await this.sleep(40)
            await this.getInfoShiki(item.shikimori_id).then(shikiItem => {
              item.material_data.poster_url = `https://shikimori.one/${shikiItem.image.original}`

            })
          }
        }
      },
      search () {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        this.timer = setTimeout(() => {
          if (this.text !== '') {
            PostsService.fetchSearchName(this.text).then(e => {
              this.mainList = this.deleteDuplicate(e.data)
            })
          } else {
            this.mainList = this.defaultList
          }
        }, 200)
      },
      filterTop () {
        this.text = ''
        this.mainList = this.topShiki
      },
      lastUpdate () {
        this.text = ''
        this.mainList = this.defaultList
      },
      doSomething () {
        alert('asd')
      },
      codeAndNameAndDesc (item) {
        return `${item.name} - ${item.name_orig} - ${item.year}`
      },
      searchchange (searchText) {
        this.searchText = searchText || this.objectItem.name

        this.searchInDB(this.searchText).then(e => {
          console.log(this.searchText)
          this.getInDB = e
        })
      }
    },
    watch: {
      text: function () {
        this.search()
      }
    }
  }

</script>
