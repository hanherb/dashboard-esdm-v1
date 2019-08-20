<template lang="pug">
  <d-container fluid class="main-content-container px-4 pb-4">
    <d-row>
      <d-col md="2" class="form-group">
        <label>Filter Asal Barang :</label>
        <d-input-group seamless>
          <d-form-select :options="origins" @change="filterBelanjaBarang($event)">
          </d-form-select>
        </d-input-group>
      </d-col>
    </d-row>
    <d-button-group class="">
      <d-button size="sm" type="button" class="btn-white" v-on:click="toggleAll">Show All</d-button>
      <d-button size="sm" type="button" class="btn-white" v-on:click="toggleRealisasi">Rencana</d-button>
      <d-button size="sm" type="button" class="btn-white" v-on:click="toggleRencana">Realisasi</d-button> 
    </d-button-group>
    <v-client-table class="dataTables_wrapper belanjaBarang" :data="belanjaBarang.tableData" :columns="belanjaBarang.columns" :options="belanjaBarang.clientTableOptions">
    </v-client-table>
    <br>
    <d-col md="12">
      <as-chart-barang-total />
    </d-col>
  </d-container>
</template>
<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';
import ChartBarangTotal from '@/components/belanja-barang/ChartBarangTotal.vue';
import Vue from 'vue';
import { ClientTable } from 'vue-tables-2';
import '@/assets/scss/vue-tables.scss';

Vue.use(ClientTable);

export default {
  name: 'rekap-belanja-barang-total',
  components: {
    ClientTable,
    asChartBarangTotal: ChartBarangTotal,
  },
  data(){
    return{
      origins: ['All'],
      belanjaBarang: {
        columns: ['', 'Kategori', 'Nasional_1', 'Provinsi_1', 'Kabupaten_1', 'Negara_1', 'Total Harga_1', 'Kuantitas_1', 'Nasional_2', 'Provinsi_2', 'Kabupaten_2', 'Negara_2', 'Total Harga_2', 'Kuantitas_2'],
        tableData: [],
        clientTableOptions: {
          headings: {
            'Nasional_1': 'Rencana Nasional', 
            'Provinsi_1': 'Rencana Provinsi', 
            'Kabupaten_1': 'Rencana Kabupaten', 
            'Negara_1': 'Rencana Negara', 
            'Total Harga_1': 'Rencana Total Harga', 
            'Kuantitas_1': 'Rencana Kuantitas',
            'Nasional_2': 'Realisasi Nasional', 
            'Provinsi_2': 'Realisasi Provinsi', 
            'Kabupaten_2': 'Realisasi Kabupaten', 
            'Negara_2': 'Realisasi Negara', 
            'Total Harga_2': 'Realisasi Total Harga', 
            'Kuantitas_2': 'Realisasi Kuantitas'
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
          'Nasional_1': 0, 
          'Provinsi_1': 0, 
          'Kabupaten_1': 0, 
          'Negara_1': 0, 
          'Kuantitas_1': 0, 
          'Total Harga_1': 0,
          'Nasional_2': 0, 
          'Provinsi_2': 0, 
          'Kabupaten_2': 0, 
          'Negara_2': 0, 
          'Kuantitas_2': 0, 
          'Total Harga_2': 0
        });
      }
    },
    resetColumn(cb) {
      this.belanjaBarang.columns = ['', 'Kategori', 'Nasional_1', 'Provinsi_1', 'Kabupaten_1', 'Negara_1', 'Total Harga_1', 'Kuantitas_1', 'Nasional_2', 'Provinsi_2', 'Kabupaten_2', 'Negara_2', 'Total Harga_2', 'Kuantitas_2'];
      if(cb)
        return cb();
    },
    fetchBelanjaBarang(cb) {
      this.belanjaBarang.tableData = [];
      this.presetTable();
      this.axios.get(address + ":3000/get-belanja-barang", headers).then((response) => {
        var totalNegaraRencana = 0;
        var totalNasionalRencana = 0;
        var totalProvinsiRencana = 0;
        var totalKabupatenRencana = 0;
        var totalQtyRencana = 0;
        var totalNegaraRealisasi = 0;
        var totalNasionalRealisasi = 0;
        var totalProvinsiRealisasi = 0;
        var totalKabupatenRealisasi = 0;
        var totalQtyRealisasi = 0;
        for(var i = 0; i < response.data.length; i++) {
          if(response.data[i].data[0]["Rencana/Realisasi"] == "Rencana") {
            var status = "rencana";
          }
          else {
            var status = "realisasi";
          }
          var negara = 0;
          var nasional = 0;
          var provinsi = 0;
          var kabupaten = 0;
          var qty = 0;
          var kategori = response.data[i].data[0]["Jenis Barang"];
          for(var j = 0; j < response.data[i].data.length; j++) {
            if(response.data[i].data[j]["Negara"]) {
              if(!this.origins.includes(response.data[i].data[j]["Negara"])) {
                this.origins.push(response.data[i].data[j]["Negara"]);
              }
              negara += response.data[i].data[j]["Total Price (US$)"];
              qty += parseInt(response.data[i].data[j]["Kuantitas"]);
              if(status == "rencana") {
                totalNegaraRencana += response.data[i].data[j]["Total Price (US$)"];
                totalQtyRencana += parseInt(response.data[i].data[j]["Kuantitas"]);
              }
              else {
                totalNegaraRealisasi += response.data[i].data[j]["Total Price (US$)"];
                totalQtyRealisasi += parseInt(response.data[i].data[j]["Kuantitas"]);
              }
            }
            else if(response.data[i].data[j]["Nasional"]) {
              if(!this.origins.includes(response.data[i].data[j]["Nasional"])) {
                this.origins.push(response.data[i].data[j]["Nasional"]);
              }
              nasional += response.data[i].data[j]["Total Price (US$)"];
              qty += parseInt(response.data[i].data[j]["Kuantitas"]);
              if(status == "rencana") {
                totalNasionalRencana += response.data[i].data[j]["Total Price (US$)"];
                totalQtyRencana += parseInt(response.data[i].data[j]["Kuantitas"]);
              }
              else {
                totalNasionalRealisasi += response.data[i].data[j]["Total Price (US$)"];
                totalQtyRealisasi += parseInt(response.data[i].data[j]["Kuantitas"]);
              }
            }
            else if(response.data[i].data[j]["Provinsi"]) {
              if(!this.origins.includes(response.data[i].data[j]["Provinsi"])) {
                this.origins.push(response.data[i].data[j]["Provinsi"]);
              }
              provinsi += response.data[i].data[j]["Total Price (US$)"];
              qty += parseInt(response.data[i].data[j]["Kuantitas"]);
              if(status == "rencana") {
                totalProvinsiRencana += response.data[i].data[j]["Total Price (US$)"];
                totalQtyRencana += parseInt(response.data[i].data[j]["Kuantitas"]);
              }
              else {
                totalProvinsiRealisasi += response.data[i].data[j]["Total Price (US$)"];
                totalQtyRealisasi += parseInt(response.data[i].data[j]["Kuantitas"]);
              }
            }
            else if(response.data[i].data[j]["Kabupaten"]) {
              if(!this.origins.includes(response.data[i].data[j]["Kabupaten"])) {
                this.origins.push(response.data[i].data[j]["Kabupaten"]);
              }
              kabupaten += response.data[i].data[j]["Total Price (US$)"];
              qty += parseInt(response.data[i].data[j]["Kuantitas"]);
              if(status == "rencana") {
                totalKabupatenRencana += response.data[i].data[j]["Total Price (US$)"];
                totalQtyRencana += parseInt(response.data[i].data[j]["Kuantitas"]);
              }
              else {
                totalKabupatenRealisasi += response.data[i].data[j]["Total Price (US$)"];
                totalQtyRealisasi += parseInt(response.data[i].data[j]["Kuantitas"]);
              }
            }
          }
          for(var k = 0; k < this.belanjaBarang.tableData.length; k++) {
            if(kategori == this.belanjaBarang.tableData[k]["Kategori"]) {
              if(status == "rencana") {
                this.belanjaBarang.tableData[k]["Negara_1"] = negara.toLocaleString();
                this.belanjaBarang.tableData[k]["Nasional_1"] = nasional.toLocaleString();
                this.belanjaBarang.tableData[k]["Provinsi_1"] = provinsi.toLocaleString();
                this.belanjaBarang.tableData[k]["Kabupaten_1"] = kabupaten.toLocaleString();
                this.belanjaBarang.tableData[k]["Kuantitas_1"] = qty.toLocaleString();
                this.belanjaBarang.tableData[k]["Total Harga_1"] = (negara + nasional + provinsi + kabupaten).toLocaleString();
              }
              else {
                this.belanjaBarang.tableData[k]["Negara_2"] = negara.toLocaleString();
                this.belanjaBarang.tableData[k]["Nasional_2"] = nasional.toLocaleString();
                this.belanjaBarang.tableData[k]["Provinsi_2"] = provinsi.toLocaleString();
                this.belanjaBarang.tableData[k]["Kabupaten_2"] = kabupaten.toLocaleString();
                this.belanjaBarang.tableData[k]["Kuantitas_2"] = qty.toLocaleString();
                this.belanjaBarang.tableData[k]["Total Harga_2"] = (negara + nasional + provinsi + kabupaten).toLocaleString();
              }
            }
          }
        }

        this.belanjaBarang.tableData.push({
          'Kategori': 'Total',
          'Negara_1': totalNegaraRencana.toLocaleString(),
          'Nasional_1': totalNasionalRencana.toLocaleString(),
          'Provinsi_1': totalProvinsiRencana.toLocaleString(),
          'Kabupaten_1': totalKabupatenRencana.toLocaleString(),
          'Kuantitas_1': totalQtyRencana.toLocaleString(),
          'Total Harga_1': (totalNegaraRencana + totalNasionalRencana + totalProvinsiRencana + totalKabupatenRencana).toLocaleString(),
          'Negara_2': totalNegaraRealisasi.toLocaleString(),
          'Nasional_2': totalNasionalRealisasi.toLocaleString(),
          'Provinsi_2': totalProvinsiRealisasi.toLocaleString(),
          'Kabupaten_2': totalKabupatenRealisasi.toLocaleString(),
          'Kuantitas_2': totalQtyRealisasi.toLocaleString(),
          'Total Harga_2': (totalNegaraRealisasi + totalNasionalRealisasi + totalProvinsiRealisasi + totalKabupatenRealisasi).toLocaleString()
        });
        if(cb)
          return cb();
      })
    },
    filterBelanjaBarang(origin) {
      if(origin == 'All') {
        this.fetchBelanjaBarang();
      }
      else {
        this.belanjaBarang.tableData = [];
        this.presetTable();
        this.axios.get(address + ":3000/get-belanja-barang", headers).then((response) => {
          var totalNegaraRencana = 0;
          var totalNasionalRencana = 0;
          var totalProvinsiRencana = 0;
          var totalKabupatenRencana = 0;
          var totalQtyRencana = 0;
          var totalNegaraRealisasi = 0;
          var totalNasionalRealisasi = 0;
          var totalProvinsiRealisasi = 0;
          var totalKabupatenRealisasi = 0;
          var totalQtyRealisasi = 0;
          for(var i = 0; i < response.data.length; i++) {
            if(response.data[i].data[0]["Rencana/Realisasi"] == "Rencana") {
              var status = "rencana";
            }
            else {
              var status = "realisasi";
            }
            var negara = 0;
            var nasional = 0;
            var provinsi = 0;
            var kabupaten = 0;
            var qty = 0;
            var kategori = response.data[i].data[0]["Jenis Barang"];
            for(var j = 0; j < response.data[i].data.length; j++) {
              if(response.data[i].data[j]["Negara"]) {
                if(response.data[i].data[j]["Negara"] == origin) {
                  negara += response.data[i].data[j]["Total Price (US$)"];
                  qty += parseInt(response.data[i].data[j]["Kuantitas"]);
                  if(status == "rencana") {
                    totalNegaraRencana += response.data[i].data[j]["Total Price (US$)"];
                    totalQtyRencana += parseInt(response.data[i].data[j]["Kuantitas"]);
                  }
                  else {
                    totalNegaraRealisasi += response.data[i].data[j]["Total Price (US$)"];
                    totalQtyRealisasi += parseInt(response.data[i].data[j]["Kuantitas"]);
                  }
                }
              }
              else if(response.data[i].data[j]["Nasional"]) {
                if(response.data[i].data[j]["Nasional"] == origin) {
                  nasional += response.data[i].data[j]["Total Price (US$)"];
                  qty += parseInt(response.data[i].data[j]["Kuantitas"]);
                  if(status == "rencana") {
                    totalNasionalRencana += response.data[i].data[j]["Total Price (US$)"];
                    totalQtyRencana += parseInt(response.data[i].data[j]["Kuantitas"]);
                  }
                  else {
                    totalNasionalRealisasi += response.data[i].data[j]["Total Price (US$)"];
                    totalQtyRealisasi += parseInt(response.data[i].data[j]["Kuantitas"]);
                  }
                }
              }
              else if(response.data[i].data[j]["Provinsi"]) {
                if(response.data[i].data[j]["Provinsi"] == origin) {
                  provinsi += response.data[i].data[j]["Total Price (US$)"];
                  qty += parseInt(response.data[i].data[j]["Kuantitas"]);
                  if(status == "rencana") {
                    totalProvinsiRencana += response.data[i].data[j]["Total Price (US$)"];
                    totalQtyRencana += parseInt(response.data[i].data[j]["Kuantitas"]);
                  }
                  else {
                    totalProvinsiRealisasi += response.data[i].data[j]["Total Price (US$)"];
                    totalQtyRealisasi += parseInt(response.data[i].data[j]["Kuantitas"]);
                  }
                }
              }
              else if(response.data[i].data[j]["Kabupaten"]) {
                if(response.data[i].data[j]["Kabupaten"] == origin) {
                  kabupaten += response.data[i].data[j]["Total Price (US$)"];
                  qty += parseInt(response.data[i].data[j]["Kuantitas"]);
                  if(status == "rencana") {
                    totalKabupatenRencana += response.data[i].data[j]["Total Price (US$)"];
                    totalQtyRencana += parseInt(response.data[i].data[j]["Kuantitas"]);
                  }
                  else {
                    totalKabupatenRealisasi += response.data[i].data[j]["Total Price (US$)"];
                    totalQtyRealisasi += parseInt(response.data[i].data[j]["Kuantitas"]);
                  }
                }
              }
            }
            for(var k = 0; k < this.belanjaBarang.tableData.length; k++) {
              if(kategori == this.belanjaBarang.tableData[k]["Kategori"]) {
                if(status == "rencana") {
                  this.belanjaBarang.tableData[k]["Negara_1"] = negara.toLocaleString();
                  this.belanjaBarang.tableData[k]["Nasional_1"] = nasional.toLocaleString();
                  this.belanjaBarang.tableData[k]["Provinsi_1"] = provinsi.toLocaleString();
                  this.belanjaBarang.tableData[k]["Kabupaten_1"] = kabupaten.toLocaleString();
                  this.belanjaBarang.tableData[k]["Kuantitas_1"] = qty.toLocaleString();
                  this.belanjaBarang.tableData[k]["Total Harga_1"] = (negara + nasional + provinsi + kabupaten).toLocaleString();
                }
                else {
                  this.belanjaBarang.tableData[k]["Negara_2"] = negara.toLocaleString();
                  this.belanjaBarang.tableData[k]["Nasional_2"] = nasional.toLocaleString();
                  this.belanjaBarang.tableData[k]["Provinsi_2"] = provinsi.toLocaleString();
                  this.belanjaBarang.tableData[k]["Kabupaten_2"] = kabupaten.toLocaleString();
                  this.belanjaBarang.tableData[k]["Kuantitas_2"] = qty.toLocaleString();
                  this.belanjaBarang.tableData[k]["Total Harga_2"] = (negara + nasional + provinsi + kabupaten).toLocaleString();
                }
              }
            }
          }

          this.belanjaBarang.tableData.push({
            'Kategori': 'Total',
            'Negara_1': totalNegaraRencana.toLocaleString(),
            'Nasional_1': totalNasionalRencana.toLocaleString(),
            'Provinsi_1': totalProvinsiRencana.toLocaleString(),
            'Kabupaten_1': totalKabupatenRencana.toLocaleString(),
            'Kuantitas_1': totalQtyRencana.toLocaleString(),
            'Total Harga_1': (totalNegaraRencana + totalNasionalRencana + totalProvinsiRencana + totalKabupatenRencana).toLocaleString(),
            'Negara_2': totalNegaraRealisasi.toLocaleString(),
            'Nasional_2': totalNasionalRealisasi.toLocaleString(),
            'Provinsi_2': totalProvinsiRealisasi.toLocaleString(),
            'Kabupaten_2': totalKabupatenRealisasi.toLocaleString(),
            'Kuantitas_2': totalQtyRealisasi.toLocaleString(),
            'Total Harga_2': (totalNegaraRealisasi + totalNasionalRealisasi + totalProvinsiRealisasi + totalKabupatenRealisasi).toLocaleString()
          });
        })
      }
    },
    coloring() {
      for(var i = 3; i <= 8; i++) {
        for(var j = 0; j < this.belanjaBarang.tableData.length; j++) {
          document.querySelectorAll(".belanjaBarang td:nth-child(" + i + ")")[j].classList.add('rencana-column');
          document.querySelectorAll(".belanjaBarang td:nth-child(" + i + ")")[j].classList.remove('realisasi-column');
        }
      }
      for(var i = 9; i <= 14; i++) {
        for(var j = 0; j < this.belanjaBarang.tableData.length; j++) {
          document.querySelectorAll(".belanjaBarang td:nth-child(" + i + ")")[j].classList.add('realisasi-column');
          document.querySelectorAll(".belanjaBarang td:nth-child(" + i + ")")[j].classList.remove('rencana-column');
        }
      }
    },
    toggleColor() {
      for(var i = 3; i <= 8; i++) {
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
          this.belanjaBarang.columns.splice(i, 6);
        }
      }
      this.toggleColor();
    },
    toggleRealisasi() {
      for(var i = 0; i < this.belanjaBarang.columns.length; i++) {
        if(this.belanjaBarang.columns[i].split('_')[1] == "2") {
          this.belanjaBarang.columns.splice(i, 6);
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
