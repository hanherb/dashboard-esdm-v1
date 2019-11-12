<template>
  <d-card class="card-small user-activity mb-4">

    <!-- Card Header -->
    <d-card-header class="border-bottom">
      <h6 class="m-0">{{ title }}</h6>
      <div class="block-handle"></div>
    </d-card-header>

    <!-- Activity Items -->
    <d-card-body class="p-0" v-for="activity in activities">

      <div class="user-activity__item pr-3 py-3">
        <div class="user-activity__item__icon">
          <i class="material-icons">&#xE7FE;</i>
        </div>
        <div class="user-activity__item__content">
          <span class="text-light">{{activity.date}}</span>
          <p>{{activity.detail}}</p>
        </div>
      </div>

    </d-card-body>
    <d-card-footer class="border-top">
      <d-button small class="btn-sm btn-white d-table mx-auto" v-if="loaded == 0" v-on:click="loadMore">Load More</d-button>
    </d-card-footer>
  </d-card>
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';
export default {
  name: 'user-activity',
  props: {
    /**
     * The component title.
     */
    title: {
      type: String,
      default: 'User Activity',
    },
  },
  data() {
    return {
      activities: [],
      loaded: 0
    }
  },

  created: function()
  {
      this.fetchLogger();
  },

  methods: {
    fetchLogger() {
      var id = parseInt(window.location.href.split("?id=")[1]);
      this.axios.get(address + ":3000/get-log", headers).then((response) => {
        response.data.reverse();
        if(response.data.length != 0) {
          for(let i = 0; i < 10; i++) {
            if(response.data[i].user_id == id) {
              this.activities.push(response.data[i]);
            }
          }
        }
      });
    },
    loadMore() {
      this.activities = [];
      this.loaded = 1;
      var id = window.location.href.split("?id=")[1];
      this.axios.get(address + ":3000/get-log", headers).then((response) => {
        response.data.reverse();
        for(let i = 0; i < response.data.length; i++) {
          if(response.data[i].userId == id) {
            this.activities.push(response.data[i]);
          }
        }
      });
    }
  }
};
</script>
