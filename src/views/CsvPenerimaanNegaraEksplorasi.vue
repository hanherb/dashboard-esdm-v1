<template lang="pug">
  div( class="container")
    div( class="panel panel-sm")
      div( class="panel-heading")
        h4 Import CSV Penerimaan Negara
      div( class="panel-body")
        div( class="form-group")
          div( class="col-sm-9")
            input( type="file" id="csv_file" name="csv_file" class="form-control" @change="loadCSV($event)")
        div( class="col-sm-offset-3 col-sm-9")
          div( class="checkbox-inline")
            label( for="header_rows") 
        d-container( fluid class="main-content-container px-4 pb-4")
          v-client-table( class="dataTables_wrapper" :data="tableData" :columns="columns" :options="clientTableOptions")
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
            d-button( theme="primary" v-on:click="addPenerimaanNegara") Submit
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
  name: 'csv-penerimaan-negara-eksplorasi',
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
    this.fetchPenerimaanNegara();
  },
  methods: {
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
      function sum(colname) {
        //Jumlah Pajak
        for(var i = 1; i < 10; i++) {
          if(!result[i][colname] || result[i][colname] == ' - ') {
            result[i][colname] = 0;
          }
          result[10][colname] = 
            parseInt(result[10][colname]) + 
            parseInt(result[i][colname]);
        }
        //Jumlah Non Pajak
        for(var i = 12; i < 17; i++) {
          if(!result[i][colname] || result[i][colname] == ' - ') {
            result[i][colname] = 0;
          }
          result[17][colname] = 
            parseInt(result[17][colname]) + 
            parseInt(result[i][colname]);
        }
        //Jumlah Penerimaan Negara
        result[18][colname] =
          parseInt(result[10][colname]) +
          parseInt(result[17][colname]);
      }
      function div(colname) {
        for(var i = 1; i <= 18; i++) {
          if(i != 11) {
            if(colname == "% REALISASI TERHADAP RENCANA TAHUN 2018") {
              result[i][colname] = result[i]["REALISASI TAHUN 2018"] / result[i]["RENCANA TAHUN 2018"] * 100;
            }
            else if(colname == "% RENCANA TAHUN 2019 TERHADAP RENCANA TAHUN 2018") {
              result[i][colname] = result[i]["RENCANA TAHUN 2019"] / result[i]["RENCANA TAHUN 2018"] * 100;
            }
          }
        }
      }

      for(var i = 2018; i <= 2019; i++) {
        sum("RENCANA TAHUN " + i);
        sum("REALISASI TAHUN " + i);
        div("% REALISASI TERHADAP RENCANA TAHUN " + i);
        div("% RENCANA TAHUN " + (i+1) + " TERHADAP RENCANA TAHUN " + i);
      }
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
          vm.tableData = vm.csvJSON(csv)
          
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
    fetchPenerimaanNegara() {
      this.axios.get(address + ":3000/get-penerimaan-negara", headers).then((response) => {
        for(var i = 0; i < response.data.length; i++) {
          if (response.data[i].upload_by == this.$session.get('user')._id) {
            this.columns = Object.keys(response.data[i].data[0]);
            this.tableData = response.data[i].data;
          }
        }
      })
    },
    addPenerimaanNegara() {
      let postObj = {
        data: this.tableData,
        upload_by: this.$session.get('user')._id,
        tahapan_kegiatan: this.$session.get('user').tahapan_kegiatan,
      };
      this.axios.post(address + ':3000/add-penerimaan-negara', postObj, headers)
      .then((response) => {
        location.reload();
        alert("Add Penerimaan Negara Success");
      });
    }
  }
};
</script>