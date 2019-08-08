<template lang="pug">
  <d-container fluid class="main-content-container px-4 pb-4">
    <d-button-group class="">
      <d-button size="sm" type="button" class="btn-white" v-on:click="toggleAll">Show All</d-button>
      <d-button size="sm" type="button" class="btn-white" v-on:click="toggleRencana">Hide Rencana</d-button>
      <d-button size="sm" type="button" class="btn-white" v-on:click="toggleRealisasi">Hide Realisasi</d-button>
    </d-button-group>
    <v-client-table class="dataTables_wrapper" :data="tableData" :columns="columns" :options="clientTableOptions">
    </v-client-table>
  </d-container>
</template>

<script>
import graphqlFunction from '../graphqlFunction';
import address from '../address';
import headers from '../headers';
import Vue from 'vue';
import { ClientTable } from 'vue-tables-2';
import '@/assets/scss/vue-tables.scss';

Vue.use(ClientTable);

export default {
  name: 'csv-sumber-pembiayaan-op',
  components: {
    ClientTable,
  },
  data() {
    return {
      parse_header: [],
      sortOrders:{},
      sortKey: '',
      columns: [],
      tableData: [],
      clientTableOptions: {
        perPage: 40,
        recordsPerPage: [10, 25, 50, 100],
        skin: 'transaction-history table dataTable',
        sortIcon: {
          base: 'fas float-right mt-1 text-muted',
          up: 'fa-caret-up',
          down: 'fa-caret-down',
        },
        texts: {
          filterPlaceholder: '',
          limit: 'Show',
        },
        pagination: {
          edge: true,
          nav: 'scroll',
        },
      },
    };
  },

  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },

  created: function()
  {
    this.fetchAnggaranBelanja();
  },

  methods: {
    fetchAnggaranBelanja() {
      var id = window.location.href.split("?id=")[1];
      this.axios.get(address + ":3000/get-anggaran-belanja", headers).then((response) => {
        for(var i = 0; i < response.data.length; i++) {
          if (response.data[i].upload_by == id) {
            this.columns = Object.keys(response.data[i].data[0]);
            this.tableData = response.data[i].data;
          }
        }
      })
    },
    toggleAll() {
      this.fetchAnggaranBelanja();
    },
    toggleRencana() {
      for(var i = 0; i < this.columns.length; i++) {
        if(this.columns[i].split(' ')[0] == "RENCANA") {
          this.columns.splice(i, 1);
        }
      }
    },
    toggleRealisasi() {
      for(var i = 0; i < this.columns.length; i++) {
        if(this.columns[i].split(' ')[0] == "REALISASI") {
          this.columns.splice(i, 1);
        }
      }
    },
  }
};
</script>