<template>
  <d-card class="card-small">

    <!-- Card Header -->
    <d-card-header class="border-bottom">
      <h6 class="m-0">{{ title }}</h6>
      <div class="block-handle"></div>
    </d-card-header>

    <d-card-body class="p-0">

      <!-- Top Referrals List Group -->
      <d-list-group flush class="list-group-small">
        <d-list-group-item v-for="(item, idx) in topImport" :key="idx" class="d-flex px-3">
          <span class="text-semibold text-fiord-blue">{{ item.name }}</span>
          <span class="ml-auto text-right text-semibold text-reagent-gray">{{ item.price.toLocaleString() }}</span>
        </d-list-group-item>
      </d-list-group>

    </d-card-body>

    <d-card-footer class="border-top">
      <d-row>

        <!-- Time Frame -->
        <d-col>
          <d-select size="sm" value="last-week" style="max-width: 130px;">
            <option value="last-week">Last Week</option>
            <option value="today">Today</option>
            <option value="last-month">Last Month</option>
            <option value="last-year">Last Year</option>
          </d-select>
        </d-col>

        <!-- View Full Report -->
        <d-col class="text-right view-report">
          <a href="#">View full report &rarr;</a>
        </d-col>

      </d-row>
    </d-card-footer>

  </d-card>
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';

export default {
  name: 'ao-top-referrals',
  props: {
    title: {
      type: String,
      default: 'Top Import',
    },
  },

  data(){
    return {
      topImport: [],
    }
  },

  created: function() 
  {
    this.fetchBelanjaBarang();
  },

  methods: {
    fetchBelanjaBarang() {
      this.axios.get(address + ":3000/get-belanja-barang").then((response) => {
        for(var i = 0; i < response.data.length; i++) {
          for(var j = 0; j < response.data[i].data.length; j++) {
            if(response.data[i].data[j]["Negara"]) {
              if(response.data[i].data[0]["Rencana/Realisasi"] == "Realisasi") {
                if(this.topImport.length < 20) {
                  this.topImport.push({
                    "name": response.data[i].data[j]["Jenis Barang"],
                    "price": response.data[i].data[j]["Total Price (US$)"]
                  });
                }
                else {
                  break;
                }
              }
            }
          }
        }
        this.topImport.sort(function(a, b){return b.price-a.price});
      });
    },
  }
};
</script>
