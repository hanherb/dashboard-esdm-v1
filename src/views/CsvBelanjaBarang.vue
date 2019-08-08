<template lang="pug">
  div( class="container")
    div( class="panel panel-sm")
      div( class="panel-heading")
        h4 Import CSV Belanja Barang
        p &#10060 = Belum upload rencana & realisasi. &#9888 = Sudah upload rencana, belum upload realisasi. &#10004 = Sudah upload rencana dan realisasi.
      div( class="panel-body")
        div( class="form-group")
          div( class="col-sm-9")
            d-row
              d-col( md="3" v-for="kategori in kategoriStatus")
                p(v-if="kategori.status == 1") Kategori {{kategori.letter}} - &#9888
                p(v-else-if="kategori.status == 0") Kategori {{kategori.letter}} - &#10060
                p(v-else) Kategori {{kategori.letter}} - &#10004
            input( type="file" id="csv_file" name="csv_file" class="form-control" @change="loadCSV($event)")
        div( class="col-sm-offset-3 col-sm-9")
          div( class="checkbox-inline")
            label( for="header_rows") 
        d-container( fluid class="main-content-container px-4 pb-4")
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
      kategori: "",
      kategoriStatus: [
        {
         'letter': 'A',
         'status': 0
        },
        {
         'letter': 'B',
         'status': 0
        },
        {
         'letter': 'C',
         'status': 0
        },
        {
         'letter': 'D',
         'status': 0
        },
        {
         'letter': 'E',
         'status': 0
        },
        {
         'letter': 'F',
         'status': 0
        },
        {
         'letter': 'G',
         'status': 0
        },
        {
         'letter': 'H',
         'status': 0
        },
        {
         'letter': 'I',
         'status': 0
        },
        {
         'letter': 'J',
         'status': 0
        },
        {
         'letter': 'K',
         'status': 0
        },
        {
         'letter': 'L',
         'status': 0
        },
        {
         'letter': 'M',
         'status': 0
        },
        {
         'letter': 'N',
         'status': 0
        },
        {
         'letter': 'O',
         'status': 0
        },
        {
         'letter': 'P',
         'status': 0
        },
        {
         'letter': 'Q',
         'status': 0
        },
        {
         'letter': 'R',
         'status': 0
        },
        {
         'letter': 'S',
         'status': 0
        },
        {
         'letter': 'T',
         'status': 0
        } 
      ]
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
    });
  },

  methods: {
    fetchBelanjaBarang(cb) {
      var id = this.$session.get('user')._id;
      this.axios.get(address + ":3000/get-belanja-barang", headers).then((response) => {
        for(var i = 0; i < response.data.length; i++) {
          if(response.data[i].upload_by == id) {
            for(var j = 0; j < this.kategoriStatus.length; j++) {
              if(this.kategoriStatus[j].letter == response.data[i].data[0]["Kategori"]) {
                this.columns = Object.keys(response.data[i].data[0]);
                this.tableData.push({"data": response.data[i].data});
                if(response.data[i].data[0]["Rencana/Realisasi"] == "Rencana") {
                  this.kategoriStatus[j].status = 1;
                }
                else if(response.data[i].data[0]["Rencana/Realisasi"] == "Realisasi") {
                  this.kategoriStatus[j].status = 2;
                }
              }
            }
          }
        }
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
      sum("Kuantitas");
      sum("Cost, Insurance, & Freight");
      sum("On Site");
      sum("Total Price (US$)");
      sum("Bobot Tertimbang (%)");

      console.log(result);
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
          vm.tableData.push({"data": vm.csvJSON(csv)});
          
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
    addBelanjaBarang() {
      let postObj = {
        data: this.tableData[this.tableData.length-1].data,
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