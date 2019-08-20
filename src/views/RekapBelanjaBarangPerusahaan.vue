<template lang="pug">
  <d-container fluid class="main-content-container px-4 pb-4">
    <d-button-group class="">
      <d-button size="sm" type="button" class="btn-white" v-on:click="toggleAll">Show All</d-button>
      <d-button size="sm" type="button" class="btn-white" v-on:click="toggleRealisasi">Rencana</d-button>
      <d-button size="sm" type="button" class="btn-white" v-on:click="toggleRencana">Realisasi</d-button> 
    </d-button-group>
    <v-client-table class="dataTables_wrapper belanjaBarang" :data="belanjaBarang.tableData" :columns="belanjaBarang.columns" :options="belanjaBarang.clientTableOptions">
    </v-client-table>
    <br>
    <d-col md="12">
      <as-chart-barang />
    </d-col>
  </d-container>
</template>
<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';
import ChartBarang from '@/components/belanja-barang/ChartBarang.vue';
import Vue from 'vue';
import { ClientTable } from 'vue-tables-2';
import '@/assets/scss/vue-tables.scss';

Vue.use(ClientTable);

export default {
  name: 'rekap-belanja-barang-perusahaan',
  components: {
    ClientTable,
    asChartBarang: ChartBarang,
  },
  data(){
    return{
      origins: ['All'],
      belanjaBarang: {
        columns: ['', 'Kategori', 'Impor_1', 'Local Content_1', 'Local Expenditure_1', 'Impor_2', 'Local Content_2', 'Local Expenditure_2'],
        tableData: [],
        clientTableOptions: {
          headings: {
            'Impor_1': 'Rencana Impor', 
            'Local Content_1': 'Rencana Local Content', 
            'Local Expenditure_1': 'Rencana Local Expenditure', 
            'Impor_2': 'Realisasi Impor', 
            'Local Content_2': 'Realisasi Local Content', 
            'Local Expenditure_2': 'Realisasi Local Expenditure', 
          },
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
      },
    }
  },

  created: function()
  {
    var vm = this;
    this.fetchBelanjaBarang(() => {
      setTimeout(function() {
        vm.coloring();
      }, 1000);
    });
  },

  methods: {
    presetTable() {
      var arrLetter = [
        'A','B','C','D','E','F','G','H','I','J',
        'K','L','M','N','O','P','Q','R','S','T'
      ];

      var arrKategori = [
        'HEAVY EQUIPMENT',
        'LAND TRANSPORT EQUIPMENT',
        'WATER TRANSPORT EQUIPMENT',
        'AIR TRANSPORT EQUIPMENT',
        'COMMUNICATION',
        'LAND SURVEY & RECOINASSANCE',
        'DRILLING EQUIPMENT',
        'SAMPLING & LAB',
        'REPAIR & MAINTENANCE',
        'BUILDING MATERIALS',
        'UTILITIES, FURNITURE & APPLIANCES',
        'CONSUMABLES: FUEL',
        'CONSUMABLES: FOOD',
        'MISCELLANEOUS',
        'MEDICAL: HEALTHY & SAFETY',
        'RECREATION FACILITY',
        'POWER STATION',
        'PROCESSING PLANT',
        'SCHOOL & TRAINING',
        'ENVIRONMENTAL'
      ];
      
      for(var i = 0; i < arrLetter.length; i++) {
        this.belanjaBarang.tableData.push({
          '': arrLetter[i],
          'Kategori': arrKategori[i],
          'Impor_1': 0, 
          'Local Content_1': 0, 
          'Local Expenditure_1': 0, 
          'Impor_2': 0, 
          'Local Content_2': 0, 
          'Local Expenditure_2': 0, 
        });
      }
    },
    resetColumn(cb) {
      this.belanjaBarang.columns = ['', 'Kategori', 'Impor_1', 'Local Content_1', 'Local Expenditure_1', 'Impor_2', 'Local Content_2', 'Local Expenditure_2'];
      if(cb)
        return cb();
    },
    fetchBelanjaBarang(cb) {
      var id = window.location.href.split("?id=")[1];
      this.belanjaBarang.tableData = [];
      this.presetTable();
      this.axios.get(address + ":3000/get-belanja-barang", headers).then((response) => {
        var totalImpor1 = 0;
        var totalLocalContent1 = 0;
        var totalLocalExpenditure1 = 0;
        var totalImpor2 = 0;
        var totalLocalContent2 = 0;
        var totalLocalExpenditure2 = 0;
        for(var i = 0; i < response.data.length; i++) {
          if(response.data[i].upload_by == id) {
            if(response.data[i].data[0]["Rencana/Realisasi"] == "Rencana") {
              var status = "rencana";
            }
            else {
              var status = "realisasi";
            }
            var impor = 0;
            var localContent = 0;
            var localExpenditure = 0;
            var kategori = response.data[i].data[0]["Jenis Barang"];
            for(var j = 0; j < response.data[i].data.length; j++) {
              if(response.data[i].data[j]["Negara"]) {
                impor += response.data[i].data[j]["Total Price (US$)"];
                if(status == "rencana") {
                  totalImpor1 += response.data[i].data[j]["Total Price (US$)"];
                }
                else {
                  totalImpor2 += response.data[i].data[j]["Total Price (US$)"];
                }
              }
              else if(response.data[i].data[j]["Produsen/Suplier"] == "Produsen") {
                localContent += response.data[i].data[j]["Total Price (US$)"];
                if(status == "rencana") {
                  totalLocalContent1 += response.data[i].data[j]["Total Price (US$)"];
                }
                else {
                  totalLocalContent2 += response.data[i].data[j]["Total Price (US$)"];
                }
              }
              else if(response.data[i].data[j]["Produsen/Suplier"] == "Suplier") {
                localExpenditure += response.data[i].data[j]["Total Price (US$)"];
                if(status == "rencana") {
                  totalLocalExpenditure1 += response.data[i].data[j]["Total Price (US$)"];
                }
                else {
                  totalLocalExpenditure2 += response.data[i].data[j]["Total Price (US$)"];
                }
              }
            }
            for(var k = 0; k < this.belanjaBarang.tableData.length; k++) {
              if(kategori == this.belanjaBarang.tableData[k]["Kategori"]) {
                if(status == "rencana") {
                  this.belanjaBarang.tableData[k]["Impor_1"] = impor.toLocaleString();
                  this.belanjaBarang.tableData[k]["Local Content_1"] = localContent.toLocaleString();
                  this.belanjaBarang.tableData[k]["Local Expenditure_1"] = localExpenditure.toLocaleString();
                }
                else {
                  this.belanjaBarang.tableData[k]["Impor_2"] = impor.toLocaleString();
                  this.belanjaBarang.tableData[k]["Local Content_2"] = localContent.toLocaleString();
                  this.belanjaBarang.tableData[k]["Local Expenditure_2"] = localExpenditure.toLocaleString();
                }
              }
            }
          }
        }

        var persentaseImpor1 = (totalImpor1 / (totalImpor1 + totalLocalContent1 + totalLocalExpenditure1)) * 100;
        var persentaseLocalContent1 = (totalLocalContent1 / (totalImpor1 + totalLocalContent1 + totalLocalExpenditure1)) * 100;
        var persentaseLocalExpenditure1 = (totalLocalExpenditure1 / (totalImpor1 + totalLocalContent1 + totalLocalExpenditure1)) * 100;
        var persentaseImpor2 = (totalImpor2 / (totalImpor2 + totalLocalContent2 + totalLocalExpenditure2)) * 100;
        var persentaseLocalContent2 = (totalLocalContent2 / (totalImpor2 + totalLocalContent2 + totalLocalExpenditure2)) * 100;
        var persentaseLocalExpenditure2 = (totalLocalExpenditure2 / (totalImpor2 + totalLocalContent2 + totalLocalExpenditure2)) * 100;

        this.belanjaBarang.tableData.push({
          'Kategori': 'Total',
          'Impor_1': totalImpor1.toLocaleString(),
          'Local Content_1': totalLocalContent1.toLocaleString(),
          'Local Expenditure_1': totalLocalExpenditure1.toLocaleString(),
          'Impor_2': totalImpor2.toLocaleString(),
          'Local Content_2': totalLocalContent2.toLocaleString(),
          'Local Expenditure_2': totalLocalExpenditure2.toLocaleString(),
        });
        this.belanjaBarang.tableData.push({
          'Kategori': 'Persentase (%)',
          'Impor_1': persentaseImpor1.toFixed(2),
          'Local Content_1': persentaseLocalContent1.toFixed(2),
          'Local Expenditure_1': persentaseLocalExpenditure1.toFixed(2),
          'Impor_2': persentaseImpor2.toFixed(2),
          'Local Content_2': persentaseLocalContent2.toFixed(2),
          'Local Expenditure_2': persentaseLocalExpenditure2.toFixed(2),
        });
        if(cb)
          return cb();
      })
    },
    coloring() {
      for(var i = 3; i <= 5; i++) {
        for(var j = 0; j < this.belanjaBarang.tableData.length; j++) {
          document.querySelectorAll(".belanjaBarang td:nth-child(" + i + ")")[j].classList.add('rencana-column');
          document.querySelectorAll(".belanjaBarang td:nth-child(" + i + ")")[j].classList.remove('realisasi-column');
        }
      }
      for(var i = 6; i <= 8; i++) {
        for(var j = 0; j < this.belanjaBarang.tableData.length; j++) {
          document.querySelectorAll(".belanjaBarang td:nth-child(" + i + ")")[j].classList.add('realisasi-column');
          document.querySelectorAll(".belanjaBarang td:nth-child(" + i + ")")[j].classList.remove('rencana-column');
        }
      }
    },
    toggleColor() {
      for(var i = 3; i <= 5; i++) {
        for(var j = 0; j < this.belanjaBarang.tableData.length; j++) {
          document.querySelectorAll(".belanjaBarang td:nth-child(" + i + ")")[j].classList.add('realisasi-column');
        }
      }
    },
    toggleAll() {
      var vm = this;
      this.resetColumn(() => {
        setTimeout(function() {
          vm.coloring();
        }, 0);
      });
    },
    toggleRencana() {
      for(var i = 0; i < this.belanjaBarang.columns.length; i++) {
        if(this.belanjaBarang.columns[i].split('_')[1] == "1") {
          this.belanjaBarang.columns.splice(i, 3);
        }
      }
      this.toggleColor();
    },
    toggleRealisasi() {
      for(var i = 0; i < this.belanjaBarang.columns.length; i++) {
        if(this.belanjaBarang.columns[i].split('_')[1] == "2") {
          this.belanjaBarang.columns.splice(i, 3);
        }
      }
    },
  }
}
</script>

<style>
  .rencana-column {
    background-color: #f2ff63;
  }

  .realisasi-column {
    background-color: #9ced66;
  }
</style>
