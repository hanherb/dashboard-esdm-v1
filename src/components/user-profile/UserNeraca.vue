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
    ClientTable,
  },
  data() {
    return {
      columns: [],
      tableData: [],
      clientTableOptions: {
        perPage: 25,
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
      neraca: [],
    }
  },

  created: function()
  {
      this.fetchNeraca();
  },

  methods: {
    fetchNeraca() {
      this.columns.push('Uraian');
      var id = window.location.href.split("?id=")[1];
      this.axios.get(address + ":3000/get-neraca", headers).then((response) => {
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
                if(response.data[i].data[j]["URAIAN"] == "Kas dan Bank") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Piutang Usaha") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Persediaan") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Jumlah Aktiva Lancar") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Aktiva Tetap") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Aktiva Eksplorasi dan Evaluasi") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Jumlah Aktiva Tidak Lancar") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Hutang Usaha") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Hutang Afiliasi Jangka Pendek") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Jumlah Kewajiban Jangka Pendek") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Hutang Bank") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Hutang Afiliasi Jangka Panjang") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Provisi untuk Reklamasi dan Penutupan Tambang") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Jumlah Kewajiban Jangka Panjang") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Modal Yang Disetor") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Laba (rugi) ditahan") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Ekuitas") {
                  if(k == this.tahun[0]) {
                    this.uraian.push(response.data[i].data[j]["URAIAN"]);
                  }
                  this.neraca.push({
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
          for(var k = 0; k < this.neraca.length; k++) {
            if(this.tableData[l]["Uraian"] == this.neraca[k]["uraian"]) {
              this.tableData[l][this.neraca[k]["tahun"]] = basicFunction.numberWithCommas(this.neraca[k]["value"]);
            }
          }
        }
      });
    }
  }
};
</script>
