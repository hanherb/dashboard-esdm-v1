<template lang="pug">
  div( class="container")
    div( class="panel panel-sm")
      div( class="panel-heading")
        h4 Import Spreadsheet Neraca Keuangan
      div( class="panel-body")
        div( class="form-group")
          div( class="col-sm-9")
            input( type="file" id="file" ref="file" v-on:change="loadCSV($event)")
        div( class="col-sm-offset-3 col-sm-9")
          div( class="checkbox-inline")
            label( for="header_rows") 
        d-container( fluid class="main-content-container px-4 pb-4")
          table( v-if="reports[0]" class="table table-bordered bg-light text-dark mb-0")
            thead( class="py-2 bg-light text-semibold border-bottom")
              tr
                th( class="text-center") Kategori
                th( class="text-center") Sub-Kategori
                th( class="text-center") Uraian
                th( class="text-center") Nilai
            tbody
              tr( v-for="balance in balances")
                td( class="lo-stats__total text-center") {{ balance.Kategori }}
                td( class="lo-stats__total text-center") {{ balance['Sub-Kategori'] }}
                td( class="lo-stats__total text-center") {{ balance.Uraian }}
                td( class="lo-stats__total text-center") {{ balance.Nilai.toLocaleString() }}
          br
          div( v-for="c in calculated")
            p {{c.Uraian}} = {{c.Nilai.toLocaleString()}}
          div( align='center' v-if="reports[0]")
            d-button( theme="primary" v-on:click="addReport") Submit
</template>

<script>
import XLSX from 'xlsx';
import gql from '@/gql';
import graphqlFunction from '../graphqlFunction';
import address from '../address';
import headers from '../headers';
import Vue from 'vue';
import { ClientTable } from 'vue-tables-2';
import '@/assets/scss/vue-tables.scss';

Vue.use(ClientTable);

export default {
  name: 'csv-neraca-op',
  components: {
    ClientTable,
  },
  data() {
    return {
      contoh: "",
      balances: [],
      reports: [],
      calculated: [],
    };
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  created: function()
  {
    this.fetchReport();
  },
  methods: {
    loadCSV(e) {
      var vm = this;
      var files = e.target.files, f = files[0];
      var reader = new FileReader();
      reader.onload = function(event) {
        var data = new Uint8Array(event.target.result);
        var workbook = XLSX.read(data, {type: 'array'});
        let reportConfig = workbook.SheetNames[0]
        let sheetName = workbook.SheetNames[1]

        let worksheetConfig = workbook.Sheets[reportConfig];
        let worksheet = workbook.Sheets[sheetName];
        vm.reports = XLSX.utils.sheet_to_json(worksheetConfig);
        vm.balances = XLSX.utils.sheet_to_json(worksheet);
        vm.spliceArray(vm.balances);
        vm.normalizeCategory(vm.balances);
        vm.calculateNeraca(vm.balances);
      };
      reader.readAsArrayBuffer(f);

      this.axios.post(address + ':3000/import-csv', {})
      .then((response) => {
        console.log(response);
      });
    },
    fetchReport() {
      var id = this.$session.get('user').user_id;
      this.axios.get(address + ":3000/get-report", headers).then((response) => {
        let query = gql.allReport;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          for(var i = 0; i < result.reports.length; i++) {
            if(result.reports[i].user_id == id) {
              this.reports.push(result.reports[i]);
            }
          }
          this.fetchNeraca();
        });
      })
    },
    addReport() {
      let postObj = {
        user_id: this.$session.get('user').user_id,
        year: this.reports[0]["Tahun"],
        term: this.reports[0]["Termin"],
        report_type: this.$session.get('user').company_type,
        currency: this.reports[0]["Mata Uang"],
        rate: this.reports[0]["Kurs"],
        approved: 0,
        flagged_for_deletion: 0
      };
      this.axios.post(address + ':3000/add-report', postObj, headers)
      .then((response) => {
        console.log(response);
        this.balances = this.balances.concat(this.calculated);
        for(var i = 0; i < this.balances.length; i++) {
          this.addNeraca(response.data.insertId, this.balances[i], this.balances.length, i);
        }
      });
    },
    fetchNeraca() {
      var id = this.$session.get('user').user_id;
      var lastReport = this.reports[this.reports.length-1];
      this.axios.get(address + ":3000/get-neraca", headers).then((response) => {
        let query = gql.allBalance;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          for(var i = 0; i < result.balances.length; i++) {
            if(result.balances[i].report_id == lastReport.report_id) {
              this.balances.push({
                'balance_id': result.balances[i].balance_id,
                'report_id': result.balances[i].report_id,
                'Kategori': result.balances[i].category,
                'Sub-Kategori': result.balances[i].sub_category,
                'Uraian': result.balances[i].detail,
                'Nilai': result.balances[i].value,
              });
            }
          }
        });
      })
    },
    calculateNeraca(balances) {
      var jumlahAktivaLancar = 0;
      var jumlahAktivaTidakLancar = 0;
      var jumlahKewajibanJangkaPendek = 0;
      var jumlahKewajibanJangkaPanjang = 0;
      var jumlahEkuitas = 0;
      for(var i = 0; i < balances.length; i++) {
        if(balances[i]["Uraian"] == "Kas dan Bank" || 
          balances[i]["Uraian"] == "Piutang Usaha" || 
          balances[i]["Uraian"] == "Pajak dibayar dimuka" || 
          balances[i]["Uraian"] == "Piutang lain-lain dan biaya dibayar dimuka" || 
          balances[i]["Uraian"] == "Persediaan") {
          jumlahAktivaLancar += balances[i]["Nilai"];
        }
        if(balances[i]["Uraian"] == "Aktiva Tetap" ||
          balances[i]["Uraian"] == "Beban ditangguhkan" ||
          balances[i]["Uraian"] == "Amortisasi" || 
          balances[i]["Uraian"] =="Depresiasi") {
          jumlahAktivaTidakLancar += balances[i]["Nilai"];
        }
        if((balances[i]["Uraian"] == "Hutang Usaha" || 
          balances[i]["Uraian"] == "Hutang Bank" || 
          balances[i]["Uraian"] == "Hutang Akrual" || 
          balances[i]["Uraian"] == "Hutang Afiliasi" || 
          balances[i]["Uraian"] == "Hutang Pajak" || 
          balances[i]["Uraian"] == "Hutang lain-lain") &&
          balances[i]["Sub-Kategori"] == "Kewajiban Jangka Pendek") {
          jumlahKewajibanJangkaPendek += balances[i]["Nilai"];
        }
        if((balances[i]["Uraian"] == "Hutang Bank" || 
          balances[i]["Uraian"] == "Hutang Pajak" || 
          balances[i]["Uraian"] == "Hutang Leasing" || 
          balances[i]["Uraian"] == "Hutang Afiliasi" || 
          balances[i]["Uraian"] == "Hutang lain-lain") &&
          balances[i]["Sub-Kategori"] == "Kewajiban Jangka Panjang") {
          jumlahKewajibanJangkaPanjang += balances[i]["Nilai"];
        }
        if(balances[i]["Uraian"] == "Modal Yang Disetor" ||
          balances[i]["Uraian"] == "Laba (rugi) ditahan" ||
          balances[i]["Uraian"] == "Lain-lain") {
          jumlahEkuitas += balances[i]["Nilai"];
        }
      }
      var jumlahAktiva = jumlahAktivaLancar + jumlahAktivaTidakLancar;
      var jumlahKewajiban = jumlahKewajibanJangkaPendek + jumlahKewajibanJangkaPanjang;
      var jumlahKewajibanDanEkuitas = jumlahKewajiban + jumlahEkuitas;

      this.calculated.push({
          'Kategori': 'NERACA',
          'Sub-Kategori': 'Aktiva Lancar',
          'Uraian': 'Jumlah Aktiva Lancar',
          'Nilai': jumlahAktivaLancar 
        }, {
          'Kategori': 'NERACA',
          'Sub-Kategori': 'Aktiva Tidak Lancar',
          'Uraian': 'Jumlah Aktiva Tidak Lancar',
          'Nilai': jumlahAktivaTidakLancar 
        }, {
          'Kategori': 'NERACA',
          'Sub-Kategori': '-',
          'Uraian': 'Jumlah Aktiva',
          'Nilai': jumlahAktiva 
        }, {
          'Kategori': 'HUTANG DAN MODAL',
          'Sub-Kategori': 'Kewajiban Jangka Pendek',
          'Uraian': 'Jumlah Kewajiban Jangka Pendek',
          'Nilai': jumlahKewajibanJangkaPendek 
        }, {
          'Kategori': 'HUTANG DAN MODAL',
          'Sub-Kategori': 'Kewajiban Jangka Panjang',
          'Uraian': 'Jumlah Kewajiban Jangka Panjang',
          'Nilai': jumlahKewajibanJangkaPanjang
        }, {
          'Kategori': 'HUTANG DAN MODAL',
          'Sub-Kategori': '-',
          'Uraian': 'Jumlah Kewajiban',
          'Nilai': jumlahKewajiban
        }, {
          'Kategori': 'HUTANG DAN MODAL',
          'Sub-Kategori': 'Modal Saham',
          'Uraian': 'Jumlah Ekuitas',
          'Nilai': jumlahEkuitas
        }, {
          'Kategori': 'HUTANG DAN MODAL',
          'Sub-Kategori': '-',
          'Uraian': 'Jumlah Kewajiban dan Ekuitas',
          'Nilai': jumlahKewajibanDanEkuitas
        }
      );
    },
    addNeraca(report_id, balances, length, i) {
      let postObj = {
        report_id: report_id,
        detail: balances["Uraian"],
        value: balances["Nilai"],
        category: balances["Kategori"],
        sub_category: balances["Sub-Kategori"],
      };
      this.axios.post(address + ':3000/add-neraca', postObj, headers)
      .then((response) => {
        if(i == length-1) {
          location.reload();
        }
      });
    },
    spliceArray(spliceFile) {
      for(var i = 0; i < spliceFile.length; i++) {
        if(!spliceFile[i].hasOwnProperty('No.')) {
          spliceFile.splice(i, 1);
        }
      }
    },
    normalizeCategory(normalizeFile) {
      var category = normalizeFile[0]['Kategori'];
      var sub = normalizeFile[0]['Sub-Kategori'];
      for(var i = 0; i < normalizeFile.length; i++) {
        if(!normalizeFile[i]['Kategori']) {
          normalizeFile[i]['Kategori'] = category;
        }
        else {
          category = normalizeFile[i]['Kategori'];
        }
        if(!normalizeFile[i]['Sub-Kategori']) {
          normalizeFile[i]['Sub-Kategori'] = sub;
        }
        else {
          sub = normalizeFile[i]['Sub-Kategori'];
        }
      }
    },
  }
};
</script>