<template lang="pug">
  <d-container fluid class="main-content-container px-4 pb-4">
    <label>Filter Tahun</label>
    <d-row>
      <d-col md="1" class="form-group">
        <d-form-select :options="tahun" @change="filterTahunFrom($event)">
        </d-form-select>
      </d-col>
      <h4>-</h4>
      <d-col md="1" class="form-group">
        <d-form-select :options="tahun" @change="filterTahunTo($event)">
        </d-form-select>
      </d-col>
      <d-col md="1" class="form-group">
        <d-button theme="primary" v-on:click="applyFilter">Apply Filter</d-button>
      </d-col>
    </d-row>
    <d-button-group class="">
      <d-button size="sm" type="button" class="btn-white" v-on:click="toggleAll">Show All</d-button>
      <d-button size="sm" type="button" class="btn-white" v-on:click="toggleRealisasi">Rencana</d-button>
      <d-button size="sm" type="button" class="btn-white" v-on:click="toggleRencana">Realisasi</d-button> 
    </d-button-group>
    <v-client-table class="dataTables_wrapper" :data="tableData" :columns="columns" :options="clientTableOptions">
    </v-client-table>
  </d-container>
</template>

<script>
import basicFunction from '../basicFunction';
import address from '../address';
import headers from '../headers';
import Vue from 'vue';
import { ClientTable } from 'vue-tables-2';
import '@/assets/scss/vue-tables.scss';

Vue.use(ClientTable);

export default {
  name: 'rekap-sumber-pembiayaan',
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
    this.fetchSumberPembiayaan();
  },

  methods: {
    fetchSumberPembiayaan(cb) {
      this.tahun = [];
      var id = window.location.href.split("?id=")[1];
      this.axios.get(address + ":3000/get-sumber-pembiayaan", headers).then((response) => {
        for(var i = 0; i < response.data.length; i++) {
          if (response.data[i].upload_by == id) {
            var keys = Object.keys(response.data[i].data[0]);
            for(var k = 0; k < keys.length; k++) {
              if(keys[k].split(' ')[0] == "REALISASI") {
                this.tahun.push(keys[k].split('REALISASI TAHUN ')[1]);
              }
            }
            for(var j = 0; j < response.data[i].data.length; j++) {
              for(var k = this.tahun[0]; k <= this.tahun[this.tahun.length-1]; k++) {
                response.data[i].data[j]["RENCANA TAHUN "+k] = basicFunction.numberWithCommas(response.data[i].data[j]["RENCANA TAHUN "+k]);
                response.data[i].data[j]["REALISASI TAHUN "+k] = basicFunction.numberWithCommas(response.data[i].data[j]["REALISASI TAHUN "+k]);
              }
            }
            if(this.tahunFrom || this.tahunTo) {
              var tempFrom;
              var tempTo;
              if(!this.tahunFrom) {
                tempFrom = this.tahun[0];
                tempTo = this.tahunTo;
              }
              else if(!this.tahunFrom) {
                tempTo = this.tahun[this.tahun.length-1];
                tempFrom = this.tahunFrom;
              }
              else {
                tempTo = this.tahunTo;
                tempFrom = this.tahunFrom;
              }
              this.columns = Object.keys(response.data[i].data[0]);
              this.tableData = response.data[i].data;
              for(var j = 0; j < this.columns.length; j++) {
                if(this.columns[j].split('TAHUN ')[1] < tempFrom || this.columns[j].split('TAHUN ')[1] > tempTo) {
                  this.columns.splice(j, 1);
                  j--;
                }
              }
            }
            else {
              this.columns = Object.keys(response.data[i].data[0]);
              this.tableData = response.data[i].data;
            }
          }
        }
        if(cb) 
          return cb();
      })
    },
    toggleAll() {
      this.fetchSumberPembiayaan();
    },
    toggleRencana() {
      this.fetchSumberPembiayaan(() => {
        for(var i = 0; i < this.columns.length; i++) {
          if(this.columns[i].split(' ')[0] == "RENCANA") {
            this.columns.splice(i, 1);
            i--;
          }
        }
      });
    },
    toggleRealisasi() {
      this.fetchSumberPembiayaan(() => {
        for(var i = 0; i < this.columns.length; i++) {
          if(this.columns[i].split(' ')[0] == "REALISASI") {
            this.columns.splice(i, 1);
            i--;
          }
        }
      });
    },
    filterTahunFrom(tahun) {
      this.tahunFrom = tahun;
    },
    filterTahunTo(tahun) {
      this.tahunTo = tahun;
    },
    applyFilter() {
      this.fetchSumberPembiayaan();
    },
  }
};
</script>