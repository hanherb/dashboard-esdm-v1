<template lang="pug">
  div( class="container")
    div( class="panel panel-sm")
      div( class="panel-heading")
        h4 Import Spreadsheet Belanja Barang
      div( class="panel-body")
        div( class="form-group")
          div( class="col-sm-9")
            d-row
            input( type="file" id="csv_file" name="csv_file" class="form-control" @change="loadCSV($event)")
        div( class="col-sm-offset-3 col-sm-9")
          div( class="checkbox-inline")
            label( for="header_rows") 
        d-container( fluid class="main-content-container px-4 pb-4")
          d-row
            d-col( md="3" class="form-group")
              d-form-select( v-model="selected_1" :options="select_kategori" @change="filterKategori($event)")
            d-col( md="3" class="form-group")
              d-form-select( v-model="selected_2" :options="select_rencana_realisasi" @change="filterRencanaRealisasi($event)")
            d-col( md="2" class="form-group")
              d-form-select( v-model="selected_3" :options="select_tahun" @change="filterTahun($event)")
            d-col( md="2" class="form-group")
              d-button( theme="primary" v-on:click="applyFilter") Apply Filter
          v-client-table( v-for="tableData in tableData" class="dataTables_wrapper csv_table_barang" :data="tableData.data" :columns="columns" :options="clientTableOptions")
              table( class="table mb-0")
                thead( class="bg-light")
                  tr
                    th( v-for="key in parse_header" @click="sortBy(key)" :class="{ active: sortKey == key }") {{ key | capitalize }}
                      span( class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'")
                tbody
                  tr( v-for="csv in tableData")
                    td( v-for="key in parse_header") {{csv[key]}}
          br
          div( align='center' v-if="tableData[0]")
            d-button( theme="primary" v-on:click="addBelanjaBarang") Submit
</template>

<script>
import graphqlFunction from '../graphqlFunction';
import address from '../address';
import headers from '../headers';
import kategoriBarang from '@/data/kategori-barang';
import Vue from 'vue';
import { ClientTable } from 'vue-tables-2';
import '@/assets/scss/vue-tables.scss';

Vue.use(ClientTable);

export default {
  name: 'csv-belanja-barang',
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
      dataToDb: {},
      filter: {
        kategori: "All",
        rencana_realisasi: "All",
        tahun: "All",
      },
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
      validation: "",
      select_kategori: [
        {value: null, text: 'Filter Kategori..', disabled: true },
        {value: 'All', text: 'Show All'},
        {value: 'HEAVY EQUIPMENT', text: 'A. HEAVY EQUIPMENT'},
        {value: 'LAND TRANSPORT EQUIPMENT', text: 'B. LAND TRANSPORT EQUIPMENT'},
        {value: 'WATER TRANSPORT EQUIPMENT', text: 'C. WATER TRANSPORT EQUIPMENT'},
        {value: 'AIR TRANSPORT EQUIPMENT', text: 'D. AIR TRANSPORT EQUIPMENT'},
        {value: 'COMMUNICATION', text: 'E. COMMUNICATION'},
        {value: 'LAND SURVEY & RECOINASSANCE', text: 'F. LAND SURVEY & RECOINASSANCE'},
        {value: 'DRILLING EQUIPMENT', text: 'G. DRILLING EQUIPMENT'},
        {value: 'SAMPLING & LAB', text: 'H. SAMPLING & LAB'},
        {value: 'REPAIR & MAINTENANCE', text: 'I. REPAIR & MAINTENANCE'},
        {value: 'BUILDING MATERIALS', text: 'J. BUILDING MATERIALS'},
        {value: 'UTILITIES, FURNITURE & APPLIANCES', text: 'K. UTILITIES, FURNITURE & APPLIANCES'},
        {value: 'CONSUMABLES: FUEL', text: 'L. CONSUMABLES: FUEL'},
        {value: 'CONSUMABLES: FOOD', text: 'M. CONSUMABLES: FOOD'},
        {value: 'MISCELLANEOUS', text: 'N. MISCELLANEOUS'},
        {value: 'MEDICAL: HEALTHY & SAFETY', text: 'O. MEDICAL: HEALTHY & SAFETY'},
        {value: 'RECREATION FACILITY', text: 'P. RECREATION FACILITY'},
        {value: 'POWER STATION', text: 'Q. POWER STATION'},
        {value: 'PROCESSING PLANT', text: 'R. PROCESSING PLANT'},
        {value: 'SCHOOL & TRAINING', text: 'S. SCHOOL & TRAINING'},
        {value: 'ENVIRONMENTAL', text: 'T. ENVIRONMENTAL'}
      ],
      select_rencana_realisasi: [
        {value: null, text: 'Filter Rencana/Realisasi..', disabled: true },
        {value: 'All', text: 'Show All'},
        {value: 'Rencana', text: 'Rencana'},
        {value: 'Realisasi', text: 'Realisasi'},
      ],
      select_tahun: [
        {value: null, text: 'Filter Tahun..', disabled: true },
        {value: 'All', text: 'Show All'},
        {value: '2018', text: '2018'},
        {value: '2019', text: '2019'},
      ],
      selected_1: null,
      selected_2: null,
      selected_3: null,
    };
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },

  created: function()
  {
    var vm = this;
    this.fetchBelanjaBarang(() => {
      setTimeout(function() {
        vm.coloring();
      }, 2000);
    }, this.filter.kategori, this.filter.rencana_realisasi, this.filter.tahun);
  },

  methods: {
    fetchBelanjaBarang(cb, kategori, rencana_realisasi, tahun) {
      var id = this.$session.get('user')._id;
      this.axios.get(address + ":3000/get-belanja-barang", headers).then((response) => {
        for(var i = 0; i < response.data.length; i++) {
          if(response.data[i].upload_by == id) {
            this.columns = Object.keys(response.data[i].data[0]);
            if((kategori == response.data[i].data[0]["Jenis Barang"] || kategori == 'All') &&
              (rencana_realisasi == response.data[i].data[0]["Rencana/Realisasi"] || rencana_realisasi == 'All') &&
              (tahun == response.data[i].data[0]["Tahun"] || tahun == 'All')) {
              for(var j = 0; j < response.data[i].data.length; j++) {
                if(response.data[i].data[j]["Cost, Insurance, & Freight"]) {
                  response.data[i].data[j]["Cost, Insurance, & Freight"] = parseInt(response.data[i].data[j]["Cost, Insurance, & Freight"]).toLocaleString();
                }
                if(response.data[i].data[j]["On Site"]) {
                  response.data[i].data[j]["On Site"] = parseInt(response.data[i].data[j]["On Site"]).toLocaleString();
                }
                if(response.data[i].data[j]["Total Price (US$)"]) {
                  response.data[i].data[j]["Total Price (US$)"] = parseInt(response.data[i].data[j]["Total Price (US$)"]).toLocaleString();
                }
              }
              this.tableData.push({"data": response.data[i].data});
            }
          }
        }
        console.log(this.tableData);
        if(cb)
          return cb();
      })
    },
    sortBy: function (key) {
      var vm = this
      vm.sortKey = key
      vm.sortOrders[key] = vm.sortOrders[key] * -1
    },
    csvJSON(csv){
      var vm = this
      var lines = csv.split(/\r\n|\n|\r/);
      var result = []
      var csvHeaders = lines[0].split(";")
      vm.parse_header = lines[0].split(";") 
      lines[0].split(",").forEach(function (key) {
        vm.sortOrders[key] = 1
      })
      
      lines.map(function(line, indexLine){
        if (indexLine < 1) return // Jump header line
        
        var obj = {}
        var currentline = line.split(";")
        
        csvHeaders.map(function(header, indexHeader){
          obj[header] = currentline[indexHeader]
        })

        result.push(obj)
      })
      this.axios.post(address + ':3000/import-csv', {}, headers)
      .then((response) => {
        console.log(response);
      });
      result.pop() // remove the last item because undefined values
      this.columns = Object.keys(result[0]);
      // this.columns[this.columns.indexOf("Self Assessment")] = "Assessment";
      // this.columns.splice(this.columns.indexOf("Surveyor"), 1);

      function sum(colname) {
        result[result.length-1][colname] = 0;
        for(var i = 1; i < result.length-1; i++) {
          if(!result[i][colname]) {
            result[result.length-1][colname] = 
              parseInt(result[result.length-1][colname]) + 0;
          }
          else {
            result[result.length-1][colname] = 
              parseInt(result[result.length-1][colname]) + 
              parseInt(result[i][colname]);
          }
        }
      }

      function prod(colname) {
        for(var i = 1; i < result.length-1; i++) {
          if(result[i]["Cost, Insurance, & Freight"]) {
            result[i][colname] = parseInt(result[i]["Kuantitas"]) * parseInt(result[i]["Cost, Insurance, & Freight"]);
          }
          else if(result[i]["On Site"]) {
            result[i][colname] = parseInt(result[i]["Kuantitas"]) * parseInt(result[i]["On Site"]);
          }
        }
      }

      function prodDiv(colname) {
        for(var i = 1; i < result.length-1; i++) {
          if(result[i]["Self Assessment"]) {
            console.log(parseInt(result[i]["Total Price (US$)"]))
            console.log(parseInt(result[result.length-2]["Total Price (US$)"]))
            console.log(parseInt(result[i]["Self Assessment"]))
            result[i][colname] = (parseInt(result[i]["Total Price (US$)"]) / parseInt(result[result.length-1]["Total Price (US$)"]) * result[i]["Self Assessment"]).toFixed(2);
          }
          else if(result[i]["Surveyor"]) {
            result[i][colname] = (parseInt(result[i]["Total Price (US$)"]) / parseInt(result[result.length-1]["Total Price (US$)"]) * result[i]["Surveyor"]).toFixed(2);
          }
        }
      }

      for(var i = 1; i < result.length-1; i++) {
        if(result[i]["Nasional"]) {
          if(result[i]["Provinsi"] || result[i]["Kabupaten"] ||result[i]["Negara"]) {
            this.validation = "Tidak bisa memilih asal barang lebih dari 1, pada barang " + result[i]["Jenis Barang"];
          }
        }
        else if(result[i]["Provinsi"]) {
          if(result[i]["Nasional"] || result[i]["Kabupaten"] ||result[i]["Negara"]) {
            this.validation = "Tidak bisa memilih asal barang lebih dari 1, pada barang " + result[i]["Jenis Barang"];
          }
        }
        else if(result[i]["Kabupaten"]) {
          if(result[i]["Nasional"] || result[i]["Provinsi"] ||result[i]["Negara"]) {
            this.validation = "Tidak bisa memilih asal barang lebih dari 1, pada barang " + result[i]["Jenis Barang"];
          }
        }
        else if(result[i]["Negara"]) {
          if(result[i]["Nasional"] || result[i]["Provinsi"] ||result[i]["Kabupaten"]) {
            this.validation = "Tidak bisa memilih asal barang lebih dari 1, pada barang " + result[i]["Jenis Barang"];
          }
          if(result[i]["Produsen/Suplier"]) {
            this.validation = "Produsen/Suplier hanya untuk barang lokal, pada barang " + result[i]["Jenis Barang"];
          }
        }

        if(result[i]["Produsen/Suplier"]) {
          if(result[i]["Produsen/Suplier"] == "S" || 
            result[i]["Produsen/Suplier"] == "s" ||
            result[i]["Produsen/Suplier"] == "Suplier" ||
            result[i]["Produsen/Suplier"] == "suplier" ||
            result[i]["Produsen/Suplier"] == "Supplier" ||
            result[i]["Produsen/Suplier"] == "supplier") {
            result[i]["Produsen/Suplier"] = "Suplier";
          }
          else if(result[i]["Produsen/Suplier"] == "P" || 
            result[i]["Produsen/Suplier"] == "p" ||
            result[i]["Produsen/Suplier"] == "Produsen" ||
            result[i]["Produsen/Suplier"] == "produsen") {
            result[i]["Produsen/Suplier"] = "Produsen";
          }
        }

        if(result[i]["Cost, Insurance, & Freight"] && result[i]["On Site"]) {
          this.validation = "Tidak bisa mengisi On Site dan Cost, Insurance, & Freight secara bersamaan, pada barang " + result[i]["Jenis Barang"];
        }

        if(result[i]["Self Assessment"] || result[i]["Surveyor"]) {
          if(result[i]["Self Assessment"]) {
            // result[i]["Assessment"] = result[i]["Self Assessment"];
          }
          else if(result[i]["Surveyor"]) {
            // result[i]["Assessment"] = result[i]["Surveyor"];
          }
        }
      }

      prod("Total Price (US$)");
      prodDiv("Bobot Tertimbang (%)");
      sum("Kuantitas");
      sum("Cost, Insurance, & Freight");
      sum("On Site");
      sum("Total Price (US$)");
      sum("Bobot Tertimbang (%)");

      return result // JavaScript object
    },
    loadCSV(e) {
      var vm = this
      if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        // Handle errors load
        reader.onload = function(event) {
          var csv = event.target.result;
          vm.dataToDb = vm.csvJSON(csv);
          vm.loadToTable(vm.csvJSON(csv));
        };
        reader.onerror = function(evt) {
          if(evt.target.error.name == "NotReadableError") {
            alert("Canno't read file !");
          }
        };
      } else {
        alert('FileReader are not supported in this browser.');
      }
    },
    loadToTable(data) {
      for(var i = 0; i < data.length; i++) {
        if(data[i]["Cost, Insurance, & Freight"]) {
          data[i]["Cost, Insurance, & Freight"] = parseInt(data[i]["Cost, Insurance, & Freight"]).toLocaleString();
        }
        if(data[i]["On Site"]) {
          data[i]["On Site"] = parseInt(data[i]["On Site"]).toLocaleString();
        }
        if(data[i]["Total Price (US$)"]) {
          data[i]["Total Price (US$)"] = parseInt(data[i]["Total Price (US$)"]).toLocaleString();
        }
      }
      this.tableData.push({"data": data});
    },
    addBelanjaBarang() {
      let postObj = {
        data: this.dataToDb,
        upload_by: this.$session.get('user')._id,
      };
      if(this.validation) {
        alert(this.validation);
      }
      else {
        this.axios.post(address + ':3000/add-belanja-barang', postObj, headers)
        .then((response) => {
          location.reload();
          alert("Add Belanja Barang Success");
        });
      }
    },
    coloring() {
      for(var i = 0; i < this.tableData.length; i++) {
        for(var j = 1; j < this.tableData[i].data.length; j++) {
          if(this.tableData[i].data[j]["Self Assessment"]) {
            document.querySelectorAll(".csv_table_barang tr:nth-child(" + (j+1) +") td:nth-child(16)")[i].classList.add('self-assessment');
          }
          else if(this.tableData[i].data[j]["Surveyor"]) {
            document.querySelectorAll(".csv_table_barang tr:nth-child(" + (j+1) +") td:nth-child(17)")[i].classList.add('surveyor');
          }
        }
      }
    },
    filterKategori(kategori) {
      this.filter.kategori = kategori;
    },
    filterRencanaRealisasi(rencana_realisasi) {
      this.filter.rencana_realisasi = rencana_realisasi;
    },
    filterTahun(tahun) {
      this.filter.tahun = tahun;
    },
    applyFilter() {
      this.tableData = [];
      var vm = this;
      this.fetchBelanjaBarang(() => {
        setTimeout(function() {
          vm.coloring();
        }, 2000);
      }, this.filter.kategori, this.filter.rencana_realisasi, this.filter.tahun);
    }
  }
};
</script>

<style>
  .csv_table_barang td:nth-child(14) {
    /*background-color: red;*/
  }

  .self-assessment {
    background-color: yellow;
  }

  .surveyor {
    background-color: #7FFF00;
  }
</style>