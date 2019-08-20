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
      <d-button-group slot="actions" slot-scope="props" size="small" class="d-flex justify-content-center">
        <d-link :to="'/update-user?id=' + props.row._id">
          <d-button class="btn-white" v-d-tooltip.hover="'Edit'">
            <i class="material-icons">&#xE254;</i>
          </d-button>
        </d-link>
        <d-link :to="'/delete-user?id=' + props.row._id">
          <d-button class="btn-white" v-d-tooltip.hover="'Delete'">
            <i class="material-icons">&#xE872;</i>
          </d-button>
        </d-link>
      </d-button-group>
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
  name: 'user-rasio-keuangan',
  props: {
    /**
     * The component title.
     */
    title: {
      type: String,
      default: 'User Rasio Keuangan',
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
      collectVar: {},
      tahunNeraca: [],
      tahunLabaRugi: [],
      uraian: [],
      neracaLabaRugi: [],
      rasioKeuangan: [],
    }
  },

  created: function()
  {
      this.fetchRasioKeuangan(() => {
        this.createTable();
      });
  },

  methods: {
    fetchRasioKeuangan(cb) {
      var id = window.location.href.split("?id=")[1];
      this.axios.get(address + ":3000/get-neraca", headers).then((response) => {
        for(let i = 0; i < response.data.length; i++) {
          if(response.data[i].upload_by == id) {
            var keys = Object.keys(response.data[i].data[0]);
            for(var k = 0; k < keys.length; k++) {
              if(keys[k].split(' ')[0] == "REALISASI") {
                this.tahunNeraca.push(keys[k].split('REALISASI TAHUN ')[1]);
              }
            }
            for(var k = this.tahunNeraca[0]; k <= this.tahunNeraca[this.tahunNeraca.length-1]; k++) {
              for(let j = 0; j < response.data[i].data.length; j++) {
                if(response.data[i].data[j]["URAIAN"] == "Jumlah Aktiva Lancar") {
                  this.neracaLabaRugi.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Jumlah Kewajiban Jangka Pendek") {
                  this.neracaLabaRugi.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Kas dan Bank") {
                  this.neracaLabaRugi.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Piutang Usaha") {
                  this.neracaLabaRugi.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "JUMLAH AKTIVA") {
                  this.neracaLabaRugi.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Jumlah Kewajiban ") {
                  this.neracaLabaRugi.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Ekuitas") {
                  this.neracaLabaRugi.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
                else if(response.data[i].data[j]["URAIAN"] == "Jumlah Kewajiban Jangka Panjang") {
                  this.neracaLabaRugi.push({
                    "uraian": response.data[i].data[j]["URAIAN"],
                    "tahun": k,
                    "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                  });
                }
              }
            }
          }
        }
        this.axios.get(address + ":3000/get-laba-rugi", headers).then((response) => {
          for(let i = 0; i < response.data.length; i++) {
            if(response.data[i].upload_by == id) {
              var keys = Object.keys(response.data[i].data[0]);
              for(var k = 0; k < keys.length; k++) {
                if(keys[k].split(' ')[0] == "REALISASI") {
                  this.tahunLabaRugi.push(keys[k].split('REALISASI TAHUN ')[1]);
                }
              }
              for(var k = this.tahunLabaRugi[0]; k <= this.tahunLabaRugi[this.tahunLabaRugi.length-1]; k++) {
                for(let j = 0; j < response.data[i].data.length; j++) {
                  if(response.data[i].data[j]["URAIAN"] == "Laba/(Rugi) Operasi" || response.data[i].data[j]["URAIAN" == "Laba/ (Rugi) Operasi"]) {
                    this.neracaLabaRugi.push({
                      "uraian": "Laba/ (Rugi) Operasi",
                      "tahun": k,
                      "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                    });
                  }
                  else if(response.data[i].data[j]["URAIAN"] == "Beban bunga") {
                    this.neracaLabaRugi.push({
                      "uraian": response.data[i].data[j]["URAIAN"],
                      "tahun": k,
                      "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                    });
                  }
                  else if(response.data[i].data[j]["URAIAN"] == "Laba/ (Rugi) Bersih" || response.data[i].data[j]["URAIAN"] == "Laba/(Rugi) Bersih") {
                    this.neracaLabaRugi.push({
                      "uraian": "Laba/ (Rugi) Bersih",
                      "tahun": k,
                      "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                    });
                  }
                  else if(response.data[i].data[j]["URAIAN"] == "Laba (Rugi) kotor" || response.data[i].data[j]["URAIAN"] == "Laba kotor") {
                    this.neracaLabaRugi.push({
                      "uraian": "Laba (Rugi) kotor",
                      "tahun": k,
                      "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                    });
                  }
                  else if(response.data[i].data[j]["URAIAN"] == "Penjualan") {
                    this.neracaLabaRugi.push({
                      "uraian": response.data[i].data[j]["URAIAN"],
                      "tahun": k,
                      "value": response.data[i].data[j]["REALISASI TAHUN "+k]
                    });
                  }
                }
              }
            }
          }
          if(cb)
            return cb();
        });
      });
    },
    createTable() {
      this.columns.push('Uraian');

      if(this.tahunNeraca[this.tahunNeraca.length-1] - this.tahunLabaRugi[this.tahunLabaRugi.length-1] < 0) {
        var whichYear = this.tahunLabaRugi;
      }
      else {
        var whichYear = this.tahunNeraca;
      }
      for(var i = 0; i < whichYear.length; i++) {
        this.columns.push(whichYear[i]);
      }

      for(var i = whichYear[0]; i <= whichYear[whichYear.length-1]; i++) {
        for(var j = 0; j < this.neracaLabaRugi.length; j++) {
          for(var k = 0; k < this.neracaLabaRugi.length; k++) {
            if(this.neracaLabaRugi[j]["uraian"] == "Jumlah Aktiva Lancar" && this.neracaLabaRugi[k]["uraian"] == "Jumlah Kewajiban Jangka Pendek") {
              if(this.neracaLabaRugi[j]["tahun"] == i && this.neracaLabaRugi[k]["tahun"] == i) {
                if(i == whichYear[0]) {
                  this.uraian.push("Rasio Lancar");
                }
                this.rasioKeuangan.push({
                  "uraian": "Rasio Lancar",
                  "tahun": i,
                  "value": this.neracaLabaRugi[j]["value"] / this.neracaLabaRugi[k]["value"]
                });
              }
            }
            else if(this.neracaLabaRugi[j]["uraian"] == "Kas dan Bank" && this.neracaLabaRugi[k]["uraian"] == "Piutang Usaha") {
              for(var l = 0; l < this.neracaLabaRugi.length; l++) {
                if(this.neracaLabaRugi[l]["uraian"] == "Jumlah Kewajiban Jangka Pendek") {
                  if(this.neracaLabaRugi[j]["tahun"] == i && this.neracaLabaRugi[k]["tahun"] == i && this.neracaLabaRugi[l]["tahun"] == i) {
                    if(i == whichYear[0]) {
                      this.uraian.push("Rasio Sangat Lancar");
                    }
                    this.rasioKeuangan.push({
                      "uraian": "Rasio Sangat Lancar",
                      "tahun": i,
                      "value": (this.neracaLabaRugi[j]["value"] + this.neracaLabaRugi[k]["value"]) / this.neracaLabaRugi[l]["value"]
                    });
                  }
                }
              }
            }
            else if(this.neracaLabaRugi[j]["uraian"] == "Piutang Usaha" && this.neracaLabaRugi[k]["uraian"] == "Jumlah Kewajiban Jangka Pendek") {
              if(this.neracaLabaRugi[j]["tahun"] == i && this.neracaLabaRugi[k]["tahun"] == i) {
                if(i == whichYear[0]) {
                  this.uraian.push("Rasio Kas");
                }
                this.rasioKeuangan.push({
                  "uraian": "Rasio Kas",
                  "tahun": i,
                  "value": this.neracaLabaRugi[j]["value"] / this.neracaLabaRugi[k]["value"]
                });
              }
            }
            else if(this.neracaLabaRugi[j]["uraian"] == "Jumlah Kewajiban " && this.neracaLabaRugi[k]["uraian"] == "JUMLAH AKTIVA") {
              if(this.neracaLabaRugi[j]["tahun"] == i && this.neracaLabaRugi[k]["tahun"] == i) {
                if(i == whichYear[0]) {
                  this.uraian.push("Rasio Utang Terhadap Aset");
                }
                this.rasioKeuangan.push({
                  "uraian": "Rasio Utang Terhadap Aset",
                  "tahun": i,
                  "value": this.neracaLabaRugi[j]["value"] / this.neracaLabaRugi[k]["value"]
                });
              }
            }
            else if(this.neracaLabaRugi[j]["uraian"] == "Jumlah Kewajiban " && this.neracaLabaRugi[k]["uraian"] == "Ekuitas") {
              if(this.neracaLabaRugi[j]["tahun"] == i && this.neracaLabaRugi[k]["tahun"] == i) {
                if(i == whichYear[0]) {
                  this.uraian.push("Rasio Utang Terhadap Modal");
                }
                this.rasioKeuangan.push({
                  "uraian": "Rasio Utang Terhadap Modal",
                  "tahun": i,
                  "value": this.neracaLabaRugi[j]["value"] / this.neracaLabaRugi[k]["value"]
                });
              }
            }
            else if(this.neracaLabaRugi[j]["uraian"] == "Jumlah Kewajiban Jangka Panjang" && this.neracaLabaRugi[k]["uraian"] == "Ekuitas") {
              if(this.neracaLabaRugi[j]["tahun"] == i && this.neracaLabaRugi[k]["tahun"] == i) {
                if(i == whichYear[0]) {
                  this.uraian.push("Rasio Utang Jangka Panjang Terhadap Modal");
                }
                this.rasioKeuangan.push({
                  "uraian": "Rasio Utang Jangka Panjang Terhadap Modal",
                  "tahun": i,
                  "value": this.neracaLabaRugi[j]["value"] / this.neracaLabaRugi[k]["value"]
                });
              }
            }
            else if(this.neracaLabaRugi[j]["uraian"] == "Laba/ (Rugi) Operasi" && this.neracaLabaRugi[k]["uraian"] == "Beban bunga") {
              if(this.neracaLabaRugi[j]["tahun"] == i && this.neracaLabaRugi[k]["tahun"] == i) {
                if(i == whichYear[0]) {
                  this.uraian.push("Rasio Kelipatan Bunga yang Dihasilkan");
                }
                this.rasioKeuangan.push({
                  "uraian": "Rasio Kelipatan Bunga yang Dihasilkan",
                  "tahun": i,
                  "value": this.neracaLabaRugi[j]["value"] / this.neracaLabaRugi[k]["value"]
                });
              }
            }
            else if(this.neracaLabaRugi[j]["uraian"] == "Laba/ (Rugi) Operasi" && this.neracaLabaRugi[k]["uraian"] == "Jumlah Kewajiban ") {
              if(this.neracaLabaRugi[j]["tahun"] == i && this.neracaLabaRugi[k]["tahun"] == i) {
                if(i == whichYear[0]) {
                  this.uraian.push("Rasio Laba Operasional Terhadap Kewajiban");
                }
                this.rasioKeuangan.push({
                  "uraian": "Rasio Laba Operasional Terhadap Kewajiban",
                  "tahun": i,
                  "value": this.neracaLabaRugi[j]["value"] / this.neracaLabaRugi[k]["value"]
                });
              }
            }
            else if(this.neracaLabaRugi[j]["uraian"] == "Laba/ (Rugi) Bersih" && this.neracaLabaRugi[k]["uraian"] == "JUMLAH AKTIVA") {
              if(this.neracaLabaRugi[j]["tahun"] == i && this.neracaLabaRugi[k]["tahun"] == i) {
                if(i == whichYear[0]) {
                  this.uraian.push("Hasil Pengembalian atas Aset");
                }
                this.rasioKeuangan.push({
                  "uraian": "Hasil Pengembalian atas Aset",
                  "tahun": i,
                  "value": this.neracaLabaRugi[j]["value"] / this.neracaLabaRugi[k]["value"]
                });
              }
            }
            else if(this.neracaLabaRugi[j]["uraian"] == "Laba/ (Rugi) Bersih" && this.neracaLabaRugi[k]["uraian"] == "Ekuitas") {
              if(this.neracaLabaRugi[j]["tahun"] == i && this.neracaLabaRugi[k]["tahun"] == i) {
                if(i == whichYear[0]) {
                  this.uraian.push("Hasil Pengembalian atas Ekuitas");
                }
                this.rasioKeuangan.push({
                  "uraian": "Hasil Pengembalian atas Ekuitas",
                  "tahun": i,
                  "value": this.neracaLabaRugi[j]["value"] / this.neracaLabaRugi[k]["value"]
                });
              }
            }
            else if(this.neracaLabaRugi[j]["uraian"] == "Laba (Rugi) kotor" && this.neracaLabaRugi[k]["uraian"] == "Penjualan") {
              if(this.neracaLabaRugi[j]["tahun"] == i && this.neracaLabaRugi[k]["tahun"] == i) {
                if(i == whichYear[0]) {
                  this.uraian.push("Marjin Laba Kotor");
                }
                this.rasioKeuangan.push({
                  "uraian": "Marjin Laba Kotor",
                  "tahun": i,
                  "value": this.neracaLabaRugi[j]["value"] / this.neracaLabaRugi[k]["value"]
                });
              }
            }
            else if(this.neracaLabaRugi[j]["uraian"] == "Laba/ (Rugi) Operasi" && this.neracaLabaRugi[k]["uraian"] == "Penjualan") {
              if(this.neracaLabaRugi[j]["tahun"] == i && this.neracaLabaRugi[k]["tahun"] == i) {
                if(i == whichYear[0]) {
                  this.uraian.push("Marjin Laba Operasional");
                }
                this.rasioKeuangan.push({
                  "uraian": "Marjin Laba Operasional",
                  "tahun": i,
                  "value": this.neracaLabaRugi[j]["value"] / this.neracaLabaRugi[k]["value"]
                });
              }
            }
            else if(this.neracaLabaRugi[j]["uraian"] == "Laba/ (Rugi) Bersih" && this.neracaLabaRugi[k]["uraian"] == "Penjualan") {
              if(this.neracaLabaRugi[j]["tahun"] == i && this.neracaLabaRugi[k]["tahun"] == i) {
                if(i == whichYear[0]) {
                  this.uraian.push("Marjin Laba Bersih");
                }
                this.rasioKeuangan.push({
                  "uraian": "Marjin Laba Bersih",
                  "tahun": i,
                  "value": this.neracaLabaRugi[j]["value"] / this.neracaLabaRugi[k]["value"]
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
        for(var k = 0; k < this.rasioKeuangan.length; k++) {
          if(this.tableData[l]["Uraian"] == this.rasioKeuangan[k]["uraian"]) {
            this.tableData[l][this.rasioKeuangan[k]["tahun"]] = this.rasioKeuangan[k]["value"].toLocaleString();
          }
        }
      }
    }
  }
};
</script>
