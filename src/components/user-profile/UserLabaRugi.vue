<template>
  <d-card class="card-small user-activity mb-4">

    <!-- Card Header -->
    <d-card-header class="border-bottom">
      <h6 class="m-0">{{ title }}</h6>
      <div class="block-handle"></div>
      <select v-model="input.year" v-on:change="filterYear()">
        <option v-for="year in years">{{year}}</option>
      </select>
    </d-card-header>

    <!-- Activity Items -->
    <table class="table bg-light text-dark mb-0">
      <thead class="py-2 bg-light text-semibold border-bottom">
        <tr>
          <th class="text-center"> Uraian </th>
          <th class="text-center"> Nilai </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="profit_loss in showProfitLoss">
          <td class="lo-stats__total text-center"> {{ profit_loss.detail }} </td>
          <td class="lo-stats__total text-center"> {{ profit_loss.value.toLocaleString() }} </td>
        </tr>
      </tbody>
    </table>
  </d-card>
</template>

<script>
import gql from '@/gql';
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';
import Vue from 'vue';

export default {
  name: 'user-laba-rugi',
  props: {
    /**
     * The component title.
     */
    title: {
      type: String,
      default: 'User Laba Rugi',
    },
  },
  components: {
  },
  data() {
    return {
      reports: [],
      profit_losses: [],
      showProfitLoss: [],
      years: [],
      input: {
        filterYear: null,
      },
    }
  },

  created: function()
  {
      this.fetchReport();
  },

  methods: {
    fetchReport() {
      var id = parseInt(window.location.href.split("?id=")[1]);
      this.axios.get(address + ":3000/get-report", headers).then((response) => {
        let query = gql.allReport;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          for(var i = 0; i < result.reports.length; i++) {
            if(result.reports[i].user_id == id) {
              this.reports.push(result.reports[i]);
              if(!this.years.includes(this.reports[i].year)) {
                this.years.push(this.reports[i].year);
                this.years.sort(function(a, b){return a-b});
              }
            }
          }
          this.fetchLabaRugi();
        });
      })
    },
    fetchLabaRugi() {
      var id = parseInt(window.location.href.split("?id=")[1]);
      this.axios.get(address + ":3000/get-laba-rugi", headers).then((response) => {
        let query = gql.allProfitLoss;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          for(var j = 0; j < this.reports.length; j++) {
            for(var i = 0; i < result.profit_losses.length; i++) {
              if(this.reports[j].report_id == result.profit_losses[i].report_id) {
                if(result.profit_losses[i].detail == 'Penjualan' ||
                  result.profit_losses[i].detail == 'Harga Pokok Penjualan' ||
                  result.profit_losses[i].detail == 'Laba Rugi Kotor' ||
                  result.profit_losses[i].detail == 'Laba Rugi Operasi' ||
                  result.profit_losses[i].detail == 'Laba Rugi Sebelum Pajak' ||
                  result.profit_losses[i].detail == 'Laba Rugi Bersih') {
                  result.profit_losses[i].year = this.reports[j].year;
                  this.profit_losses.push(result.profit_losses[i]);
                }
              }
            }
          }
          this.showLabaRugi();
        });
      })
    },
    showLabaRugi() {
      for(var i = 0; i < this.profit_losses.length; i++) {
        if(this.profit_losses[i].year == this.years[this.years.length-1]) {
          this.showProfitLoss.push(this.profit_losses[i]);
        }
      }
    },
    filterYear() {
      this.showProfitLoss = [];
      for(var i = 0; i < this.profit_losses.length; i++) {
        if(this.profit_losses[i].year == this.input.year) {
          this.showProfitLoss.push(this.profit_losses[i]);
        }
      }
    }
  }
};
</script>
