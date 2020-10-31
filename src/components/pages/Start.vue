
<template>
  <div>

<!--
    <div>
      <b-button-group>
        <b-button>  <router-link to="/posts">Posts</router-link> </b-button>
        <b-button>  <b-link href="/top">top</b-link> </b-button>
      </b-button-group>
    </div>
-->

    <router-link to="/">mainPage</router-link>
    <router-view></router-view>

    <div>
      <b-nav pills>
        <b-nav-item href="/posts" active>posts</b-nav-item>
        <b-nav-item href="/top">top</b-nav-item>
        <b-nav-form @submit.prevent="yourFormSubmissionMethod">
          <b-form-input aria-label="Input" class="mr-1"></b-form-input>
          <b-button type="submit">Ok</b-button>
        </b-nav-form>
      </b-nav>
    </div>
    <button v-on:click="counter++">Add 1</button>
    <p>The button above has been clicked {{ counter }} times.</p>
  </div>

</template>

<script>

import PostsService from '@/services/PostsService'
export default {
  name: 'posts',

  data () {
    return {
      counter:2,
      posts: []
    }
  },
  async mounted () {
    await this.getPosts()

  },
  methods: {
    yourFormSubmissionMethod(){
      alert("asd");
    },
    async getPosts () {
      const response = await PostsService.fetchMainPage()
      this.posts = response.data

    }
  }
}

</script>
