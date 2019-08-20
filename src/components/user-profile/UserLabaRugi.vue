<template>
  <d-card class="card-small user-activity mb-4">

    <!-- Card Header -->
    <d-card-header class="border-bottom">
      <h6 class="m-0">{{ title }}</h6>
      <div class="block-handle"></div>
    </d-card-header>

    <!-- Activity Items -->
    <v-client-table class="dataTables_wrapper" :data="tableData" :columns="columns" :options="clientTableOptions">
      <!-- Actions Column Slot -->
    </v-client-table>
  </d-card>
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';
import Vue from 'vue';
import { ClientTable } from 'vue-tables-2';
import '@/assets/scss/vue-tables.scss';

Vue.use(ClientTable);

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
    ClientTable,
  },
  data() {
    return {
      columns: [],
      tableData: [],
      clientTableOptions: {
        perPage: 10,
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
      tahun: [],
      uraian: [],
      labaRugi: [],
    }
  },

  created: function()
  {
      this.fetchLabaRugi();
  },

  methods: {
    fetchLabaRugi() {
      this.columns.push('Uraian');
      var id = window.location.href.split("?id=")[1];
      this.axios.get(address + ":3000/get-laba-rugi", headers).then((response) => {
        for(let i = 0; i < response.data.length; i++) {
          if(response.data[i].upload_by == id) {
            var keys = Object.keys(response.data[i].data[0]);
            for(var k = 0; k < keys.length; k++) {
              if(keys[k].split(' ')[0] == "REALISASI") {
                this.tahun.push(keys[k].split('REALISASI TAHUN ')[1]);
              }
            }
            for(var k = this.tahun[0]; k <= this.tahun[this.tahun.length-1]; k++) {
              this.columns.push(String(k));
              for(let j = 0; j < response.data[i].data.length; j++) {
                if(response.data[i].data[j]["URAIAN"] == "Penjualan") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.labaRugi.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Harga Pokok Penjualan") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.labaRugi.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Laba (Rugi) kotor") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.labaRugi.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Laba/ (Rugi) Operasi") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.labaRugi.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Laba/(Rugi) sebelum Pajak") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.labaRugi.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Laba/ (Rugi) Bersih") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.labaRugi.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
              }
            }
          }
        }
        for(var k = 0; k < this.uraian.length; k++) {
          this.tableData.push({
            "Uraian": this.uraian[k],
          });
        }
        for(var l = 0; l < this.tableData.length; l++) {
          for(var k = 0; k < this.labaRugi.length; k++) {
            if(this.tableData[l]["Uraian"] == this.labaRugi[k]["uraian"]) {
              this.tableData[l][this.labaRugi[k]["tahun"]] = basicFunction.numberWithCommas(this.labaRugi[k]["value"]);
            }
          }
        }
      });
    }
  }
};
</script>
