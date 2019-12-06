<template lang="pug">
  div( class="container")
    div( class="panel panel-sm")
      div( class="panel-heading")
        h4 Import Spreadsheet Belanja Barang
      div( class="panel-body")
        div( class="form-group")
          div( class="col-sm-9")
            input( type="file" id="file" ref="file" v-on:change="loadCSV($event)")
        div( class="col-sm-offset-3 col-sm-9")
          div( class="checkbox-inline")
            label( for="header_rows") 
        d-container( fluid class="main-content-container px-4 pb-4")
          table( v-if="barangA[0]" class="table table-bordered bg-light text-dark mb-0")
            thead( class="py-2 bg-light text-semibold border-bottom")
              tr
                th( class="text-center") Kategori
                <!-- th( class="text-center") Sub-Kategori -->
                th( class="text-center") Uraian
                th( class="text-center") Nilai
            tbody
              tr( v-for="barang in barangA")
                td( class="lo-stats__total text-center") {{ barang.Kategori }}
                <!-- td( class="lo-stats__total text-center") {{ profit_loss['Sub-Kategori'] }} -->
                td( class="lo-stats__total text-center") {{ barang.Uraian }}
                td( class="lo-stats__total text-center") {{ barang.Nilai.toLocaleString() }}
          br
          div( align='center' v-if="barangA[0]")
            d-button( theme="primary" v-on:click="addBelanjaBarang") Submit
</template>

<script>
import XLSX from 'xlsx';
import gql from '@/gql';
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
      barangA: [],
      barangB: [],
      barangC: [],
      barangD: [],
      barangE: [],
      barangF: [],
      barangG: [],
      barangH: [],
      barangI: [],
      barangJ: [],
      barangK: [],
      barangL: [],
      barangM: [],
      barangN: [],
      barangO: [],
      barangP: [],
      barangQ: [],
      barangR: [],
      barangS: [],
      barangT: [],
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
        {value: '2015', text: '2015'},
        {value: '2016', text: '2016'},
        {value: '2017', text: '2017'},
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
    // csvJSON(csv){
    //   var vm = this
    //   var lines = csv.split(/\r\n|\n|\r/);
    //   var result = []
    //   var csvHeaders = lines[0].split(";")
    //   vm.parse_header = lines[0].split(";") 
    //   lines[0].split(",").forEach(function (key) {
    //     vm.sortOrders[key] = 1
    //   })
      
    //   lines.map(function(line, indexLine){
    //     if (indexLine < 1) return // Jump header line
        
    //     var obj = {}
    //     var currentline = line.split(";")
        
    //     csvHeaders.map(function(header, indexHeader){
    //       obj[header] = currentline[indexHeader]
    //     })

    //     result.push(obj)
    //   })
    //   this.axios.post(address + ':3000/import-csv', {}, headers)
    //   .then((response) => {
    //     console.log(response);
    //   });
    //   result.pop() // remove the last item because undefined values
    //   this.columns = Object.keys(result[0]);
    //   // this.columns[this.columns.indexOf("Self Assessment")] = "Assessment";
    //   // this.columns.splice(this.columns.indexOf("Surveyor"), 1);

    //   function sum(colname) {
    //     result[result.length-1][colname] = 0;
    //     for(var i = 1; i < result.length-1; i++) {
    //       if(!result[i][colname]) {
    //         result[result.length-1][colname] = 
    //           parseInt(result[result.length-1][colname]) + 0;
    //       }
    //       else {
    //         result[result.length-1][colname] = 
    //           parseInt(result[result.length-1][colname]) + 
    //           parseInt(result[i][colname]);
    //       }
    //     }
    //   }

    //   function prod(colname) {
    //     for(var i = 1; i < result.length-1; i++) {
    //       if(result[i]["Cost, Insurance, & Freight"]) {
    //         result[i][colname] = parseInt(result[i]["Kuantitas"]) * parseInt(result[i]["Cost, Insurance, & Freight"]);
    //       }
    //       else if(result[i]["On Site"]) {
    //         result[i][colname] = parseInt(result[i]["Kuantitas"]) * parseInt(result[i]["On Site"]);
    //       }
    //     }
    //   }

    //   function prodDiv(colname) {
    //     for(var i = 1; i < result.length-1; i++) {
    //       if(result[i]["Self Assessment"]) {
    //         result[i][colname] = (parseInt(result[i]["Total Price (US$)"]) / parseInt(result[result.length-1]["Total Price (US$)"]) * result[i]["Self Assessment"]).toFixed(2);
    //       }
    //       else if(result[i]["Surveyor"]) {
    //         result[i][colname] = (parseInt(result[i]["Total Price (US$)"]) / parseInt(result[result.length-1]["Total Price (US$)"]) * result[i]["Surveyor"]).toFixed(2);
    //       }
    //     }
    //   }

    //   for(var i = 1; i < result.length-1; i++) {
    //     if(result[i]["Nasional"]) {
    //       if(result[i]["Provinsi"] || result[i]["Kabupaten"] ||result[i]["Negara"]) {
    //         this.validation = "Tidak bisa memilih asal barang lebih dari 1, pada barang " + result[i]["Jenis Barang"];
    //       }
    //     }
    //     else if(result[i]["Provinsi"]) {
    //       if(result[i]["Nasional"] || result[i]["Kabupaten"] ||result[i]["Negara"]) {
    //         this.validation = "Tidak bisa memilih asal barang lebih dari 1, pada barang " + result[i]["Jenis Barang"];
    //       }
    //     }
    //     else if(result[i]["Kabupaten"]) {
    //       if(result[i]["Nasional"] || result[i]["Provinsi"] ||result[i]["Negara"]) {
    //         this.validation = "Tidak bisa memilih asal barang lebih dari 1, pada barang " + result[i]["Jenis Barang"];
    //       }
    //     }
    //     else if(result[i]["Negara"]) {
    //       if(result[i]["Nasional"] || result[i]["Provinsi"] ||result[i]["Kabupaten"]) {
    //         this.validation = "Tidak bisa memilih asal barang lebih dari 1, pada barang " + result[i]["Jenis Barang"];
    //       }
    //       if(result[i]["Produsen/Suplier"]) {
    //         this.validation = "Produsen/Suplier hanya untuk barang lokal, pada barang " + result[i]["Jenis Barang"];
    //       }
    //     }

    //     if(result[i]["Produsen/Suplier"]) {
    //       if(result[i]["Produsen/Suplier"] == "S" || 
    //         result[i]["Produsen/Suplier"] == "s" ||
    //         result[i]["Produsen/Suplier"] == "Suplier" ||
    //         result[i]["Produsen/Suplier"] == "suplier" ||
    //         result[i]["Produsen/Suplier"] == "Supplier" ||
    //         result[i]["Produsen/Suplier"] == "supplier") {
    //         result[i]["Produsen/Suplier"] = "Suplier";
    //       }
    //       else if(result[i]["Produsen/Suplier"] == "P" || 
    //         result[i]["Produsen/Suplier"] == "p" ||
    //         result[i]["Produsen/Suplier"] == "Produsen" ||
    //         result[i]["Produsen/Suplier"] == "produsen") {
    //         result[i]["Produsen/Suplier"] = "Produsen";
    //       }
    //     }

    //     if(result[i]["Cost, Insurance, & Freight"] && result[i]["On Site"]) {
    //       this.validation = "Tidak bisa mengisi On Site dan Cost, Insurance, & Freight secara bersamaan, pada barang " + result[i]["Jenis Barang"];
    //     }

    //     if(result[i]["Self Assessment"] || result[i]["Surveyor"]) {
    //       if(result[i]["Self Assessment"]) {
    //         // result[i]["Assessment"] = result[i]["Self Assessment"];
    //       }
    //       else if(result[i]["Surveyor"]) {
    //         // result[i]["Assessment"] = result[i]["Surveyor"];
    //       }
    //     }
    //   }

    //   prod("Total Price (US$)");
    //   sum("Kuantitas");
    //   sum("Cost, Insurance, & Freight");
    //   sum("On Site");
    //   sum("Total Price (US$)");
    //   prodDiv("Bobot Tertimbang (%)");
    //   sum("Bobot Tertimbang (%)");

    //   return result // JavaScript object
    // },
    loadCSV(e) {
      var vm = this;
      var files = e.target.files, f = files[0];
      var reader = new FileReader();
      reader.onload = function(event) {
        var data = new Uint8Array(event.target.result);
        var workbook = XLSX.read(data, {type: 'array'});

        let barangA = workbook.SheetNames[0]
        let barangB = workbook.SheetNames[1]
        let barangC = workbook.SheetNames[2]
        let barangD = workbook.SheetNames[3]
        let barangE = workbook.SheetNames[4]
        let barangF = workbook.SheetNames[5]
        let barangG = workbook.SheetNames[6]
        let barangH = workbook.SheetNames[7]
        let barangI = workbook.SheetNames[8]
        let barangJ = workbook.SheetNames[9]
        let barangK = workbook.SheetNames[10]
        let barangL = workbook.SheetNames[11]
        let barangM = workbook.SheetNames[12]
        let barangN = workbook.SheetNames[13]
        let barangO = workbook.SheetNames[14]
        let barangP = workbook.SheetNames[15]
        let barangQ = workbook.SheetNames[16]
        let barangR = workbook.SheetNames[17]
        let barangS = workbook.SheetNames[18]
        let barangT = workbook.SheetNames[19]

        let worksheetBarangA = workbook.Sheets[barangA];
        let worksheetBarangB = workbook.Sheets[barangB];
        let worksheetBarangC = workbook.Sheets[barangC];
        let worksheetBarangD = workbook.Sheets[barangD];
        let worksheetBarangE = workbook.Sheets[barangE];
        let worksheetBarangF = workbook.Sheets[barangF];
        let worksheetBarangG = workbook.Sheets[barangG];
        let worksheetBarangH = workbook.Sheets[barangH];
        let worksheetBarangI = workbook.Sheets[barangI];
        let worksheetBarangJ = workbook.Sheets[barangJ];
        let worksheetBarangK = workbook.Sheets[barangK];
        let worksheetBarangL = workbook.Sheets[barangL];
        let worksheetBarangM = workbook.Sheets[barangM];
        let worksheetBarangN = workbook.Sheets[barangN];
        let worksheetBarangO = workbook.Sheets[barangO];
        let worksheetBarangP = workbook.Sheets[barangP];
        let worksheetBarangQ = workbook.Sheets[barangQ];
        let worksheetBarangR = workbook.Sheets[barangR];
        let worksheetBarangS = workbook.Sheets[barangS];
        let worksheetBarangT = workbook.Sheets[barangT];

        vm.barangA = XLSX.utils.sheet_to_json(worksheetBarangA);
        vm.barangB = XLSX.utils.sheet_to_json(worksheetBarangB);
        vm.barangC = XLSX.utils.sheet_to_json(worksheetBarangC);
        vm.barangD = XLSX.utils.sheet_to_json(worksheetBarangD);
        vm.barangE = XLSX.utils.sheet_to_json(worksheetBarangE);
        vm.barangF = XLSX.utils.sheet_to_json(worksheetBarangF);
        vm.barangG = XLSX.utils.sheet_to_json(worksheetBarangG);
        vm.barangH = XLSX.utils.sheet_to_json(worksheetBarangH);
        vm.barangI = XLSX.utils.sheet_to_json(worksheetBarangI);
        vm.barangJ = XLSX.utils.sheet_to_json(worksheetBarangJ);
        vm.barangK = XLSX.utils.sheet_to_json(worksheetBarangK);
        vm.barangL = XLSX.utils.sheet_to_json(worksheetBarangL);
        vm.barangM = XLSX.utils.sheet_to_json(worksheetBarangM);
        vm.barangN = XLSX.utils.sheet_to_json(worksheetBarangN);
        vm.barangO = XLSX.utils.sheet_to_json(worksheetBarangO);
        vm.barangP = XLSX.utils.sheet_to_json(worksheetBarangP);
        vm.barangQ = XLSX.utils.sheet_to_json(worksheetBarangQ);
        vm.barangR = XLSX.utils.sheet_to_json(worksheetBarangR);
        vm.barangS = XLSX.utils.sheet_to_json(worksheetBarangS);
        vm.barangT = XLSX.utils.sheet_to_json(worksheetBarangT);
      };
      reader.readAsArrayBuffer(f);

      this.axios.post(address + ':3000/import-csv', {})
      .then((response) => {
        console.log(response);
      });
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
        user_id: this.$session.get('user').user_id,
        year: 2019,
        term: "Triwulan I",
        report_type: this.$session.get('user').company_type,
        approved: 0,
        flagged_for_deletion: 0
      };
      this.axios.post(address + ':3000/add-report-barang', postObj, headers)
      .then((response) => {
        let query = gql.addReportProcurement;
        postObj.report_procurement_id = response.data.insertId;
        let variables = {
          input: postObj
        }
        graphqlFunction.graphqlMutation(query, variables, (result) => {
          var belanjaBarang = [{
            detail: "Truck",
            specification: "Good Truck",
            project_area: "Jakarta",
            tkdn: 35,
            country_of_origin: "",
            province_of_origin: "Jakarta",
            district_of_origin: "",
            city_of_origin: "",
            qty: 3,
            category: "A",
            unit_price: 50000,
          }, {
            detail: "Helm",
            specification: "Good Helm",
            project_area: "Bandung",
            tkdn: 25,
            country_of_origin: "",
            province_of_origin: "Bandung",
            district_of_origin: "",
            city_of_origin: "",
            qty: 30,
            category: "N",
            unit_price: 3000,
          }];
          for(var i = 0; i < belanjaBarang.length; i++) {
            let postObj2 = {
              detail: belanjaBarang[i].detail,
              specification: belanjaBarang[i].specification,
              project_area: belanjaBarang[i].project_area,
              tkdn: belanjaBarang[i].tkdn,
              report_procurement_id: postObj.report_procurement_id,
              country_of_origin: belanjaBarang[i].country_of_origin,
              province_of_origin: belanjaBarang[i].province_of_origin,
              district_of_origin: belanjaBarang[i].district_of_origin,
              city_of_origin: belanjaBarang[i].city_of_origin,
              qty: belanjaBarang[i].qty,
              category: belanjaBarang[i].category,
              unit_price: belanjaBarang[i].unit_price,
            };
            this.axios.post(address + ':3000/add-belanja-barang', postObj2, headers)
            .then((response) => {
              let query = gql.addProcurement;
              postObj2.procurements_id = response.data.insertId;
              let variables = {
                input: postObj2
              }
              graphqlFunction.graphqlMutation(query, variables, (result) => {
                console.log(result);
              });
            });    
          }
        });
      });
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