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
        <tr v-for="balance in showBalance">
          <td class="lo-stats__total text-center"> {{ balance.detail }} </td>
          <td class="lo-stats__total text-center"> {{ balance.value.toLocaleString() }} </td>
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
  name: 'user-neraca',
  props: {
    /**
     * The component title.
     */
    title: {
      type: String,
      default: 'User Neraca',
    },
  },
  components: {
  },
  data() {
    return {
      reports: [],
      balances: [],
      showBalance: [],
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
          this.fetchNeraca();
        });
      })
    },
    fetchNeraca() {
      var id = parseInt(window.location.href.split("?id=")[1]);
      this.axios.get(address + ":3000/get-neraca", headers).then((response) => {
        let query = gql.allBalance;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          for(var j = 0; j < this.reports.length; j++) {
            for(var i = 0; i < result.balances.length; i++) {
              if(this.reports[j].report_id == result.balances[i].report_id) {
                if(result.balances[i].detail == 'Kas dan Bank' ||
                  result.balances[i].detail == 'Piutang Usaha' ||
                  result.balances[i].detail == 'Persediaan' ||
                  result.balances[i].detail == 'Jumlah Aktiva Lancar' ||
                  result.balances[i].detail == 'Aktiva Tetap' ||
                  result.balances[i].detail == 'Aktiva Eksplorasi' ||
                  result.balances[i].detail == 'Jumlah Aktiva Tidak Lancar' ||
                  result.balances[i].detail == 'Hutang Usaha' ||
                  (result.balances[i].detail == 'Hutang Afiliasi' && result.balances[i].sub_category == 'Kewajiban Jangka Pendek') ||
                  result.balances[i].detail == 'Jumlah Kewajiban Jangka Pendek' ||
                  result.balances[i].detail == 'Hutang Bank' ||
                  (result.balances[i].detail == 'Hutang Afiliasi' && result.balances[i].sub_category == 'Kewajiban Jangka Panjang') ||
                  result.balances[i].detail == 'Provisi Reklamasi dan Pasca Tambang' ||
                  result.balances[i].detail == 'Jumlah Kewajiban Jangka Panjang' ||
                  result.balances[i].detail == 'Modal Yang Disetor' ||
                  result.balances[i].detail == 'Laba (rugi) ditahan' ||
                  result.balances[i].detail == 'Jumlah Ekuitas') {
                  result.balances[i].year = this.reports[j].year;
                  this.balances.push(result.balances[i]);
                }
              }
            }
          }
          this.showNeraca();
        });
      })
    },
    showNeraca() {
      for(var i = 0; i < this.balances.length; i++) {
        if(this.balances[i].year == this.years[this.years.length-1]) {
          this.showBalance.push(this.balances[i]);
        }
      }
    },
    filterYear() {
      this.showBalance = [];
      for(var i = 0; i < this.balances.length; i++) {
        if(this.balances[i].year == this.input.year) {
          this.showBalance.push(this.balances[i]);
        }
      }
    }
  }
};
</script>
