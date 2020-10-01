<template>

  <div class="">

    <div class="container">
      <!-- <router-link  to="/" class="btn btn-primary">Главная</router-link>-->
      <div class="media row" v-if="animeInfo.material_data">
        <div class="mr-3 col-md-3 col-sm-12">
          <img v-bind:src="animeInfo.material_data.poster_url" alt="">
          {{ animeInfo.title }}
        </div>
        <div class="media-body  col-md-9 col-sm-12">


          <!-- <div class="player-container">
             <vue-core-video-player  v-if="playList.length>0" @play="playFunc" v-bind:src="playList"></vue-core-video-player>
           </div>-->
          <anime-player v-if="playList.length>0" v-bind:playList="playList"></anime-player>
          <div class="counter">
            <button type="button" @click="setEpisode(-1)" class="btn btn-outline-primary">Предыдущая серия</button>
            <button type="button" class="btn btn-outline-secondary">{{ this.episode }} серия</button>
            <button type="button" @click="setEpisode(12,true)" class="btn btn-outline-secondary">из {{
                this.maxEpisodes
              }}
            </button>
            <button type="button" @click="setEpisode(1)" class="btn btn-outline-primary">Следующая серия</button>
          </div>

        </div>
      </div>
      <div class="row">

        <div class="col-md-3 col-sm-12">
          <div class="list-group">
            <a v-for="(item,index) in posts.results" v-if="item.translation" :key="index"
               class="list-group-item list-group-item-action" v-bind:class="{active:active_el === item.id   }"
               @click="activate(item.id) ">
              {{ item.translation.title }}
            </a>
          </div>
        </div>
        <div class="col-md-9 col-sm-12">

          <!-- Using value -->
          <b-button @click="visible===1?visible=0:visible=1" class="m-1">Описание</b-button>
          <b-button @click="()=>{visible=2}" class="m-1">Хронология</b-button>
          <div :class="{'d-none' :visible!==1}" id="collapse-1">
            <div class="toggle-desc" @click="toggleDesc()">
              <span>Описание</span>
              <span v-if="desc">скрыть</span>
              <span v-if="!desc">открыть</span>

              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-down-short" fill="currentColor"
                   xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                      d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
              </svg>
            </div>
            <div v-if="animeInfo.material_data" v-bind:class="{'d-none': desc!==true }" class="description">
              <h5 class="mt-0"> {{ animeInfo.title }} / {{ animeInfo.title_orig }}</h5>
              {{ animeInfo.material_data.description }}
              <div><span>Год:</span> {{ animeInfo.material_data.year }}</div>
              <div><span>Рейтин Shikimori:</span> {{ animeInfo.material_data.shikimori_rating }}</div>
              <div v-if="animeInfo.material_data.anime_genres"><span>Жанры:</span>
                {{ animeInfo.material_data.anime_genres.join(", ") }}
              </div>
              <div v-if="animeInfoShiki.next_episode_at"><span>Следующий эпизод:</span>
                {{ new Date(animeInfoShiki.next_episode_at).toLocaleString() }}
              </div>
              <div><span>Кол-во эпизодов:</span> {{ animeInfoShiki.episodes }}</div>
              <div><span>Последний эпизод:</span> {{ animeInfo.last_episode }}</div>
              <div><span>Озвучено:</span> {{ this.minEpisodes }} - {{ this.maxEpisodes }}</div>
            </div>
          </div>
          <div :class="{'d-none' :visible!==2}" id="collapse-2">

            <!-- <div class="anime-list">
               <div v-for="(item,index) in animeFranchise" v-if="animeFranchise" :key="index" class="card ">
                 <router-link
                   :to="{ name: 'play', params: { shiki_id: item.id,name:(item.name.replaceAll(' ', '_')) }}">
                   <div class="poster" :style="{ backgroundImage: `url('${item.image_url.replaceAll('x96', 'original')}')` }">
                     <img v-bind:src="require(`@/assets/play.svg`)" alt="">
                   </div>
                   <div class="card-body" v-if="item.name">
                     <div class="card-title"> {{ item.name }}</div>
                   </div>

               </div>
             </div>-->
            <div class="fran-list">
              <div v-for="(item,index) in animeFranchise" v-if="animeFranchise" :key="index" class="card">
                <div class="row no-gutters">
                  <div class="col-md-4">
                    <router-link v-if="item.inBase"
                                 :to="{ name: 'play', params: { shiki_id: item.id,name:(item.name.replaceAll(' ', '_')) }}">
                      <img v-bind:src="item.image_url.replaceAll('x96', 'original')" class="card-img" alt="">
                    </router-link>
                    <img v-else v-bind:src="item.image_url.replaceAll('x96', 'original')" class="card-img" alt="">
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">{{ item.name }}</h5>
                      <p class="card-text">{{ item.year }} </p>
                      <p class="card-text">{{ item.inBase }} </p>
                      <p class="card-text"><small class="text-muted">{{ item.kind }}</small></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>


        </div>
      </div>

    </div>


  </div>

</template>

<style lang="scss" rel="stylesheet/scss">
.card-img-top {
  height: 300px;
  object-fit: contain;
}

.counter {
  display: flex;
  justify-content: center;
}

.media-body span {
  font-weight: bold;
}

.fran-list {
  display: flex;
  flex-wrap: wrap;

  > div {
    width: 50%;
  }
}

@media (max-width: 576px) {
  .counter {
    flex-wrap: wrap;
  }

  .counter button:first-child, .counter button:last-child {
    width: 100%;
  }

  .card {
    width: 49%;
  }

}

.anime-list {

  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;


  @media (max-width: 576px) {


    width: 49%;

  }

}

@media (max-width: 576px) {


  width: 49%;

}


</style>

<script>

import animePlayer from '@/components/pages/anime-player'
import PostsService from '@/services/PostsService'

export default {
  name: 'posts',
  components: {
    animePlayer
  },
  data() {
    return {
      posts: [],
      desc: '',
      visible: 1,
      serialId: [],
      text: ["123", "asd"],
      active_el: 0,
      episode: 1,
      animeInfo: [],
      animeInfoShiki: [],
      minEpisodes: 0,
      maxEpisodes: 0,
      animeFranchise: [],
      playList: [/*
        {
          src: 'https://media.vued.vanthink.cn/y2mate.com%20-%20Sparkle%20_%20Your%20Name%20AMV_K_7To_y9IAM_240p.mp4',
          resolution: '240p'
        }*/]
    }
  },
  async mounted() {

    this.desc = localStorage.desc === 'false' ? false : true;

    await this.getListDubbing();
    if (this.posts.results[0].id) {
      await this.getSerialById(this.posts.results[0].id)
      this.getInfoShiki().then(r => {
        this.animeInfoShiki = r;
      });
    } else {
      console.log('Не получен список озвучки')
    }
    this.animeFranchise = await this.getShikiFranchise();
  },
  methods: {
    async getListDubbing() {
      const response = await PostsService.fetcGetByIdShiki(this.$route.params.shiki_id)
      this.posts = response.data
      return response.data;
    },
    async getSerialById(id) {
      const response = await PostsService.fetcGetBySerialId(id)
      this.animeInfo = response.data.results[0];
      this.serialId = response.data
    },
    async getInfoShiki(id) {
      const response = await PostsService.shikiAnime(this.$route.params.shiki_id)
      return response.data
    },
    async getPlayList(serial_id, season, episode) {
      const response = await PostsService.fetcPlayList(serial_id, season, episode)
      return response.data;
    },
    async getShikiFranchise() {
      const response = await PostsService.shikiFranchise(this.$route.params.shiki_id)
      return response.data;
    },
    async setPlayer() {
      let list = await this.getPlayList(this.active_el, this.animeInfo.last_season, this.episode);
      let playListParse = (JSON.parse(JSON.stringify(list)));
      let newPlayLists = [];
      Object.keys(playListParse).forEach(function (key) {
        newPlayLists.push({
          src: playListParse[key][0].src.split(":hls:manifest.m3u8")[0].replaceAll('//', 'https://'),
          resolution: key + "p"
        })
      });
      this.playList = newPlayLists;
    },
    activate: function (el) {
      this.animeEpisodeUpdate();
      this.active_el = el;
      this.getSerialById(this.active_el)

      this.$router.push({name: 'play', query: {dubbing: this.active_el, eppisose: this.episode}})
    },
    playFunc() {
      console.log('play!')
    },
    setEpisode(next, goTo = false) {
      if (this.episode + next <= this.maxEpisodes && this.episode + next >= this.minEpisodes || goTo) {

        if (goTo)
          this.episode = next;
        else
          this.episode += next;

        this.$router.push({name: 'play', query: {dubbing: this.active_el, eppisose: this.episode}})
        this.setPlayer();
      }
    },
    animeEpisodeUpdate() {
      let season = this.animeInfo.last_season;
      if(this.animeInfo.seasons){
        let Episodes = this.animeInfo.seasons[season]['episodes']
        let keysEpisodes = Object.keys(Episodes)
        this.minEpisodes = keysEpisodes[0];
        this.maxEpisodes = keysEpisodes[keysEpisodes.length - 1];
        this.episode = parseInt(keysEpisodes[0]);
      }else{
        this.minEpisodes = 1
        this.maxEpisodes = 1
      }

      if (this.$route.query.eppisose && this.$route.query.dubbing) {
        this.active_el = this.$route.query.dubbing;
        this.episode = parseInt(this.$route.query.eppisose)
      }

      if (this.episode > this.maxEpisodes)
        this.episode = this.maxEpisodes
      else if (this.episode < this.minEpisodes)
        this.episode = this.minEpisodes;
    },
    toggleDesc() {
      this.desc = !this.desc
      localStorage.desc = this.desc;

      console.log(localStorage.desc)
    }
  },
  watch: {
    async $route(to, from) {
      await this.getListDubbing();
      await this.getSerialById(this.posts.results[0].id)

      this.animeEpisodeUpdate();

    },
    text: async function (val) {
      console.log(val);
    },
    animeInfo: function () {

      this.active_el = this.animeInfo.id;
      this.animeEpisodeUpdate();
      /*   if (this.episode > this.maxEpisodes)
           this.episode = this.maxEpisodes*/

      this.setPlayer();
    }
  }
}

</script>
