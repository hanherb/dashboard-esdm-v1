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
                <!-- th( class="text-center") Sub-Kategori -->
                th( class="text-center") Uraian
                th( class="text-center") Nilai
            tbody
              tr( v-for="cashflow in cashflows")
                td( class="lo-stats__total text-center") {{ cashflow.Kategori }}
                <!-- td( class="lo-stats__total text-center") {{ profit_loss['Sub-Kategori'] }} -->
                td( class="lo-stats__total text-center") {{ cashflow.Uraian }}
                td( class="lo-stats__total text-center") {{ cashflow.Nilai.toLocaleString() }}
          br
          div( v-for="c in calculated_cashflow")
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
  name: 'xls-keuangan-op',
  components: {
    ClientTable,
  },
  data() {
    return {
      contoh: "",
      balances: [],
      profit_losses: [],
      national_incomes: [],
      cashflows: [],
      budgets: [],
      costofgoods: [],
      source_of_financings: [],
      investments: [],
      other_finances: [],
      assumptions: [],
      reports: [],
      calculated_balance: [],
      calculated_profit_loss: [],
      calculated_national_income: [],
      calculated_cashflow: [],
      calculated_budget: [],
      calculated_costofgood: [],
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
        let sheetNeraca = workbook.SheetNames[1]
        let sheetLabaRugi = workbook.SheetNames[2]
        let sheetArusKas = workbook.SheetNames[3]
        let sheetAsumsiKeuangan = workbook.SheetNames[4]
        let sheetAnggaranBelanja = workbook.SheetNames[5]
        let sheetHPP = workbook.SheetNames[6]
        let sheetSumberPembiayaan = workbook.SheetNames[7]
        let sheetInvestasi = workbook.SheetNames[8]
        let sheetKeuanganLainnya = workbook.SheetNames[9]
        let sheetPenerimaanNegara = workbook.SheetNames[10]

        let worksheetConfig = workbook.Sheets[reportConfig];
        let worksheetNeraca = workbook.Sheets[sheetNeraca];
        let worksheetLabaRugi = workbook.Sheets[sheetLabaRugi];
        let worksheetPenerimaanNegara = workbook.Sheets[sheetPenerimaanNegara];
        let worksheetArusKas = workbook.Sheets[sheetArusKas];
        let worksheetAsumsiKeuangan = workbook.Sheets[sheetAsumsiKeuangan];
        let worksheetAnggaranBelanja = workbook.Sheets[sheetAnggaranBelanja];
        let worksheetHPP = workbook.Sheets[sheetHPP];
        let worksheetSumberPembiayaan = workbook.Sheets[sheetSumberPembiayaan];
        let worksheetInvestasi = workbook.Sheets[sheetInvestasi];
        let worksheetKeuanganLainnya = workbook.Sheets[sheetKeuanganLainnya];

        vm.reports = XLSX.utils.sheet_to_json(worksheetConfig);
        vm.balances = XLSX.utils.sheet_to_json(worksheetNeraca);
        vm.profit_losses = XLSX.utils.sheet_to_json(worksheetLabaRugi);
        vm.national_incomes = XLSX.utils.sheet_to_json(worksheetPenerimaanNegara);
        vm.cashflows = XLSX.utils.sheet_to_json(worksheetArusKas);
        vm.assumptions = XLSX.utils.sheet_to_json(worksheetAsumsiKeuangan);
        vm.budgets = XLSX.utils.sheet_to_json(worksheetAnggaranBelanja);
        vm.costofgoods = XLSX.utils.sheet_to_json(worksheetHPP);
        vm.source_of_financings = XLSX.utils.sheet_to_json(worksheetSumberPembiayaan);
        vm.investments = XLSX.utils.sheet_to_json(worksheetInvestasi);
        vm.other_finances = XLSX.utils.sheet_to_json(worksheetKeuanganLainnya);

        vm.spliceArray(vm.balances);
        vm.normalizeCategory(vm.balances);

        vm.spliceArray(vm.profit_losses);
        vm.normalizeCategory(vm.profit_losses);

        vm.spliceArray(vm.national_incomes);
        vm.normalizeCategory(vm.national_incomes);

        vm.spliceArray(vm.cashflows);
        vm.normalizeCategory(vm.cashflows);

        vm.spliceArray(vm.assumptions);

        vm.spliceArray(vm.budgets);
        vm.normalizeCategory(vm.budgets);

        vm.spliceArray(vm.costofgoods);

        vm.spliceArray(vm.source_of_financings);

        vm.spliceArray(vm.investments);

        vm.spliceArray(vm.other_finances);

        vm.calculateNeraca(vm.balances);
        vm.calculateLabaRugi(vm.profit_losses);
        vm.calculatePenerimaanNegara(vm.national_incomes);
        vm.calculateArusKas(vm.cashflows);
        vm.calculateAnggaranBelanja(vm.budgets);
        vm.calculateHPP(vm.costofgoods);
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
        let query = gql.addReport;
        postObj.report_id = response.data.insertId;
        let variables = {
          input: postObj
        }
        graphqlFunction.graphqlMutation(query, variables, (result) => {
          this.balances = this.balances.concat(this.calculated_balance);
          this.profit_losses = this.profit_losses.concat(this.calculated_profit_loss);
          this.national_incomes = this.national_incomes.concat(this.calculated_national_income);
          this.cashflows = this.cashflows.concat(this.calculated_cashflow);
          this.budgets = this.budgets.concat(this.calculated_budget);
          this.costofgoods = this.costofgoods.concat(this.calculated_costofgood);
          this.addNeraca(postObj.report_id);
          this.addLabaRugi(postObj.report_id);
          this.addPenerimaanNegara(postObj.report_id);
          this.addArusKas(postObj.report_id);
          this.addAsumsiKeuangan(postObj.report_id);
          this.addAnggaranBelanja(postObj.report_id);
          this.addHPP(postObj.report_id);
          this.addSumberPembiayaan(postObj.report_id);
          this.addInvestasi(postObj.report_id);
          this.addKeuanganLainnya(postObj.report_id);
        });
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
          balances[i]["Uraian"] == "Aktiva Eksplorasi" ||
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
          balances[i]["Uraian"] == "Provisi Reklamasi dan Pasca Tambang" || 
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

      this.calculated_balance.push({
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
    addNeraca(report_id) {
      for(var i = 0; i < this.balances.length; i++) {
        let postObj = {
          report_id: report_id,
          detail: this.balances[i]["Uraian"],
          value: this.balances[i]["Nilai"],
          category: this.balances[i]["Kategori"],
          sub_category: this.balances[i]["Sub-Kategori"],
        };
        this.axios.post(address + ':3000/add-neraca', postObj, headers)
        .then((response) => {
          let query = gql.addBalance;
          postObj.balance_id = response.data.insertId;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            
          });
        });    
      }
    },
    // fetchLabaRugi() {
    //   var id = this.$session.get('user').user_id;
    //   var lastReport = this.reports[this.reports.length-1];
    //   this.axios.get(address + ":3000/get-laba-rugi", headers).then((response) => {
    //     let query = gql.allBalance;
    //     graphqlFunction.graphqlFetchAll(query, (result) => {
    //       for(var i = 0; i < result.balances.length; i++) {
    //         if(result.balances[i].report_id == lastReport.report_id) {
    //           this.balances.push({
    //             'balance_id': result.balances[i].balance_id,
    //             'report_id': result.balances[i].report_id,
    //             'Kategori': result.balances[i].category,
    //             'Sub-Kategori': result.balances[i].sub_category,
    //             'Uraian': result.balances[i].detail,
    //             'Nilai': result.balances[i].value,
    //           });
    //         }
    //       }
    //     });
    //   })
    // },
    calculateLabaRugi(profit_losses) {
      var jumlahBebanOperasi = 0;
      var jumlahPendapatanLainLain = 0;
      for(var i = 0; i < profit_losses.length; i++) {
        if(profit_losses[i]["Uraian"] == "Penjualan") {
          var penjualan = profit_losses[i]["Nilai"];
        }
        if(profit_losses[i]["Uraian"] == "Royalti") {
          var royalti = profit_losses[i]["Nilai"];
        }
        if(profit_losses[i]["Uraian"] == "Harga Pokok Penjualan") {
          var hpp = profit_losses[i]["Nilai"];
        }
        if(profit_losses[i]["Uraian"] == "Beban Penjualan" ||
          profit_losses[i]["Uraian"] == "Beban Umum" ||
          profit_losses[i]["Uraian"] == "Beban Lain-Lain") {
          jumlahBebanOperasi += profit_losses[i]["Nilai"];
        }
        if(profit_losses[i]["Uraian"] == "Beban Bunga" || 
          profit_losses[i]["Uraian"] == "Laba Selisih Kurs" || 
          profit_losses[i]["Uraian"] == "Pendapatan Bunga" || 
          profit_losses[i]["Uraian"] == "Beban Lain-Lain" || 
          profit_losses[i]["Uraian"] == "Rugi Selisih Kurs, Bersih") {
          jumlahPendapatanLainLain += profit_losses[i]["Nilai"];
        }
        if(profit_losses[i]["Uraian"] == "Biaya Pajak Penghasilan") {
          var biayaPajakPenghasilan = profit_losses[i]["Nilai"];
        }
      }
      var labaRugiKotor = penjualan - royalti - hpp;
      var labaRugiOperasi = labaRugiKotor - jumlahBebanOperasi;
      var labaRugiSebelumPajak = labaRugiOperasi + jumlahPendapatanLainLain;
      var labaRugiBersih = labaRugiSebelumPajak - biayaPajakPenghasilan;

      this.calculated_profit_loss.push({
          'Kategori': 'PENDAPATAN',
          'Uraian': 'Laba Rugi Kotor',
          'Nilai': labaRugiKotor 
        }, {
          'Kategori': 'BEBAN OPERASI',
          'Uraian': 'Jumlah Beban Operasi',
          'Nilai': jumlahBebanOperasi 
        }, {
          'Kategori': 'BEBAN OPERASI',
          'Uraian': 'Laba Rugi Operasi',
          'Nilai': labaRugiOperasi 
        }, {
          'Kategori': 'PENDAPATAN/(BEBAN) LAIN-LAIN',
          'Uraian': 'Jumlah Pendapatan Lain Lain',
          'Nilai': jumlahPendapatanLainLain 
        }, {
          'Kategori': 'PENDAPATAN/(BEBAN) LAIN-LAIN',
          'Uraian': 'Laba Rugi Sebelum Pajak',
          'Nilai': labaRugiSebelumPajak 
        }, {
          'Kategori': 'PENDAPATAN/(BEBAN) LAIN-LAIN',
          'Uraian': 'Laba Rugi Bersih',
          'Nilai': labaRugiBersih 
        }
      );
    },
    addLabaRugi(report_id) {
      for(var i = 0; i < this.profit_losses.length; i++) {
        let postObj = {
          report_id: report_id,
          detail: this.profit_losses[i]["Uraian"],
          value: this.profit_losses[i]["Nilai"],
          category: this.profit_losses[i]["Kategori"]
        };
        this.axios.post(address + ':3000/add-laba-rugi', postObj, headers)
        .then((response) => {
          let query = gql.addProfitLoss;
          postObj.profit_loss_id = response.data.insertId;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            
          });
        });
      }
    },
    // fetchPenerimaanNegara() {
    //   var id = this.$session.get('user').user_id;
    //   var lastReport = this.reports[this.reports.length-1];
    //   this.axios.get(address + ":3000/get-laba-rugi", headers).then((response) => {
    //     let query = gql.allBalance;
    //     graphqlFunction.graphqlFetchAll(query, (result) => {
    //       for(var i = 0; i < result.balances.length; i++) {
    //         if(result.balances[i].report_id == lastReport.report_id) {
    //           this.balances.push({
    //             'balance_id': result.balances[i].balance_id,
    //             'report_id': result.balances[i].report_id,
    //             'Kategori': result.balances[i].category,
    //             'Sub-Kategori': result.balances[i].sub_category,
    //             'Uraian': result.balances[i].detail,
    //             'Nilai': result.balances[i].value,
    //           });
    //         }
    //       }
    //     });
    //   })
    // },
    calculatePenerimaanNegara(national_incomes) {
      var jumlahPajak = 0;
      var jumlahNonPajak = 0;
      for(var i = 0; i < national_incomes.length; i++) {
        if(national_incomes[i]["Uraian"] == "PPH Pasal 21" || 
          national_incomes[i]["Uraian"] == "PPH Pasal 22" || 
          national_incomes[i]["Uraian"] == "PPH Pasal 23/26" || 
          national_incomes[i]["Uraian"] == "PPH Pasal 25" || 
          national_incomes[i]["Uraian"] == "PPH Pasal 29" || 
          national_incomes[i]["Uraian"] == "PPN Masukan" || 
          national_incomes[i]["Uraian"] == "PPN Keluaran" || 
          national_incomes[i]["Uraian"] == "Pajak-pajak daerah" || 
          national_incomes[i]["Uraian"] == "Lumpsum Payment") {
          jumlahPajak += national_incomes[i]["Nilai"];
        }

        if(national_incomes[i]["Uraian"] == "Royalti" ||
          national_incomes[i]["Uraian"] == "Deadrent" ||
          national_incomes[i]["Uraian"] == "SPW3D" ||
          national_incomes[i]["Uraian"] == "Advance Payment" ||
          national_incomes[i]["Uraian"] == "BBN") {
          jumlahNonPajak += national_incomes[i]["Nilai"];
        }
      }
      var jumlahPenerimaanNegara = jumlahPajak + jumlahNonPajak;

      this.calculated_national_income.push({
          'Kategori': 'PAJAK',
          'Uraian': 'Jumlah Pajak',
          'Nilai': jumlahPajak 
        }, {
          'Kategori': 'NON PAJAK',
          'Uraian': 'Jumlah Non Pajak',
          'Nilai': jumlahNonPajak 
        }, {
          'Kategori': '-',
          'Uraian': 'Jumlah Penerimaan Negara',
          'Nilai': jumlahPenerimaanNegara 
        }
      );
    },
    addPenerimaanNegara(report_id) {
      for(var i = 0; i < this.national_incomes.length; i++) {
        let postObj = {
          report_id: report_id,
          detail: this.national_incomes[i]["Uraian"],
          value: this.national_incomes[i]["Nilai"],
          category: this.national_incomes[i]["Kategori"]
        };
        this.axios.post(address + ':3000/add-penerimaan-negara', postObj, headers)
        .then((response) => {
          let query = gql.addNationalIncome;
          postObj.national_income_id = response.data.insertId;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            
          });
        });
      }
    },
    // fetchArusKas() {
    //   var id = this.$session.get('user').user_id;
    //   var lastReport = this.reports[this.reports.length-1];
    //   this.axios.get(address + ":3000/get-laba-rugi", headers).then((response) => {
    //     let query = gql.allBalance;
    //     graphqlFunction.graphqlFetchAll(query, (result) => {
    //       for(var i = 0; i < result.balances.length; i++) {
    //         if(result.balances[i].report_id == lastReport.report_id) {
    //           this.balances.push({
    //             'balance_id': result.balances[i].balance_id,
    //             'report_id': result.balances[i].report_id,
    //             'Kategori': result.balances[i].category,
    //             'Sub-Kategori': result.balances[i].sub_category,
    //             'Uraian': result.balances[i].detail,
    //             'Nilai': result.balances[i].value,
    //           });
    //         }
    //       }
    //     });
    //   })
    // },
    calculateArusKas(cashflows) {
      var arusKasNettoDigunakanUntukAktivitasOperasi = 0;
      var arusKasNettoYangDigunakanUntukAktivitasInvestasi = 0;
      var arusKasNettoYangDigunakanUntukAktivitasPendanaan = 0;
      var labaRugiBersihTahunBerjalan = 0; //ambil dari laba rugi
      for(var i = 0; i < cashflows.length; i++) {
        if(cashflows[i]["Kategori"] == "AKTIVITAS OPERASI") {
          arusKasNettoDigunakanUntukAktivitasOperasi += parseInt(cashflows[i]["Nilai"].replace( /^\D+/g, '');
        }

        if(cashflows[i]["Kategori"] == "AKTIVITAS INVESTASI") {
          arusKasNettoYangDigunakanUntukAktivitasInvestasi += parseInt(cashflows[i]["Nilai"].replace( /^\D+/g, ''));
        }

        if(cashflows[i]["Kategori"] == "AKTIVITAS PENDANAAN") {
          arusKasNettoYangDigunakanUntukAktivitasPendanaan += parseInt(cashflows[i]["Nilai"].replace( /^\D+/g, ''));
        }
      }
      var kenaikanPenurunanNettoKasDanBank = 
          arusKasNettoDigunakanUntukAktivitasOperasi + 
          arusKasNettoYangDigunakanUntukAktivitasInvestasi + 
          arusKasNettoYangDigunakanUntukAktivitasPendanaan + 
          labaRugiBersihTahunBerjalan;

      this.calculated_cashflow.push({
          'Kategori': 'AKTIVITAS OPERASI',
          'Uraian': 'Arus Kas Netto digunakan untuk Aktivitas Operasi',
          'Nilai': arusKasNettoDigunakanUntukAktivitasOperasi 
        }, {
          'Kategori': 'AKTIVITAS INVESTASI',
          'Uraian': 'Arus Kas Netto yang digunakan untuk aktivitas Investasi',
          'Nilai': arusKasNettoYangDigunakanUntukAktivitasInvestasi 
        }, {
          'Kategori': 'AKTIVITAS PENDANAAN',
          'Uraian': 'Arus Kas Netto Yang Digunakan Untuk Aktivitas Pendanaan',
          'Nilai': arusKasNettoYangDigunakanUntukAktivitasPendanaan 
        }, {
          'Kategori': '-',
          'Uraian': 'Laba / Rugi Bersih Tahun Berjalan',
          'Nilai': labaRugiBersihTahunBerjalan 
        }, {
          'Kategori': '-',
          'Uraian': 'Kenaikan / Penurunan Netto Kas dan Bank',
          'Nilai': kenaikanPenurunanNettoKasDanBank 
        }
      );
    },
    addArusKas(report_id) {
      for(var i = 0; i < this.cashflows.length; i++) {
        let postObj = {
          report_id: report_id,
          detail: this.cashflows[i]["Uraian"],
          value: this.cashflows[i]["Nilai"],
          category: this.cashflows[i]["Kategori"]
        };
        this.axios.post(address + ':3000/add-arus-kas', postObj, headers)
        .then((response) => {
          let query = gql.addCashflow;
          postObj.cashflow_id = response.data.insertId;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            
          });
        });
      }
    },
    // fetchAsumsiKeuangan() {
    //   var id = this.$session.get('user').user_id;
    //   var lastReport = this.reports[this.reports.length-1];
    //   this.axios.get(address + ":3000/get-laba-rugi", headers).then((response) => {
    //     let query = gql.allBalance;
    //     graphqlFunction.graphqlFetchAll(query, (result) => {
    //       for(var i = 0; i < result.balances.length; i++) {
    //         if(result.balances[i].report_id == lastReport.report_id) {
    //           this.balances.push({
    //             'balance_id': result.balances[i].balance_id,
    //             'report_id': result.balances[i].report_id,
    //             'Kategori': result.balances[i].category,
    //             'Sub-Kategori': result.balances[i].sub_category,
    //             'Uraian': result.balances[i].detail,
    //             'Nilai': result.balances[i].value,
    //           });
    //         }
    //       }
    //     });
    //   })
    // },
    addAsumsiKeuangan(report_id) {
      for(var i = 0; i < this.assumptions.length; i++) {
        let postObj = {
          report_id: report_id,
          currency: this.assumptions[i]["Mata Uang"],
          unit_rate: 1,
          detail: this.assumptions[i]["Uraian"],
          volume_unit: this.assumptions[i]["Satuan"],
          volume_value: this.assumptions[i]["Volume"],
          price_value: this.assumptions[i]["Harga Jual"],
          cutoff_grade_value: this.assumptions[i]["Cut Off Grade Nilai"],
          cutoff_grade_unit: this.assumptions[i]["Cut Off Grade Satuan"],
        };
        this.axios.post(address + ':3000/add-asumsi-keuangan', postObj, headers)
        .then((response) => {
          let query = gql.addAssumption;
          postObj.assumption_id = response.data.insertId;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            
          });
        });
      }
    },
    // fetchAnggaranBelanja() {
    //   var id = this.$session.get('user').user_id;
    //   var lastReport = this.reports[this.reports.length-1];
    //   this.axios.get(address + ":3000/get-laba-rugi", headers).then((response) => {
    //     let query = gql.allBalance;
    //     graphqlFunction.graphqlFetchAll(query, (result) => {
    //       for(var i = 0; i < result.balances.length; i++) {
    //         if(result.balances[i].report_id == lastReport.report_id) {
    //           this.balances.push({
    //             'balance_id': result.balances[i].balance_id,
    //             'report_id': result.balances[i].report_id,
    //             'Kategori': result.balances[i].category,
    //             'Sub-Kategori': result.balances[i].sub_category,
    //             'Uraian': result.balances[i].detail,
    //             'Nilai': result.balances[i].value,
    //           });
    //         }
    //       }
    //     });
    //   })
    // },
    calculateAnggaranBelanja(budgets) {
      var jumlahAnggaranBelanja = 0;

      for(var i = 0; i < budgets.length; i++) {
        jumlahAnggaranBelanja += budgets[i]["Nilai"];
      }

      this.calculated_budget.push({
          'Kategori': '-',
          'Uraian': 'Jumlah Anggaran Belanja',
          'Nilai': jumlahAnggaranBelanja 
        }
      );
    },
    addAnggaranBelanja(report_id) {
      for(var i = 0; i < this.budgets.length; i++) {
        let postObj = {
          report_id: report_id,
          detail: this.budgets[i]["Uraian"],
          value: this.budgets[i]["Nilai"],
          category: this.budgets[i]["Kategori"]
        };
        this.axios.post(address + ':3000/add-anggaran-belanja', postObj, headers)
        .then((response) => {
          let query = gql.addBudget;
          postObj.budget_id = response.data.insertId;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            
          });
        });
      }
    },
    // fetchHPP() {
    //   var id = this.$session.get('user').user_id;
    //   var lastReport = this.reports[this.reports.length-1];
    //   this.axios.get(address + ":3000/get-laba-rugi", headers).then((response) => {
    //     let query = gql.allBalance;
    //     graphqlFunction.graphqlFetchAll(query, (result) => {
    //       for(var i = 0; i < result.balances.length; i++) {
    //         if(result.balances[i].report_id == lastReport.report_id) {
    //           this.balances.push({
    //             'balance_id': result.balances[i].balance_id,
    //             'report_id': result.balances[i].report_id,
    //             'Kategori': result.balances[i].category,
    //             'Sub-Kategori': result.balances[i].sub_category,
    //             'Uraian': result.balances[i].detail,
    //             'Nilai': result.balances[i].value,
    //           });
    //         }
    //       }
    //     });
    //   })
    // },
    calculateHPP(costofgoods) {
      var temp = 0;

      for(var i = 0; i < costofgoods.length; i++) {
        if(costofgoods[i]["Uraian"] != "Persediaan Awal" && costofgoods[i]["Uraian"] != "Persediaan Akhir") {
          temp += costofgoods[i]["Nilai"];
        }
        if(costofgoods[i]["Uraian"] != "Persediaan Awal") {
          var persediaanAwal = costofgoods[i]["Nilai"];
        }
        if(costofgoods[i]["Uraian"] != "Persediaan Akhir") {
          var persediaanAkhir = costofgoods[i]["Nilai"];
        }
      }

      var totalPersediaan = persediaanAwal - persediaanAkhir;
      var totalHPP = temp + totalPersediaan;

      this.calculated_costofgood.push({
          'Uraian': 'Total Persediaan',
          'Nilai': totalPersediaan 
        }, {
          'Uraian': 'Total HPP',
          'Nilai': totalHPP 
        }
      );
    },
    addHPP(report_id) {
      for(var i = 0; i < this.costofgoods.length; i++) {
        let postObj = {
          report_id: report_id,
          detail: this.costofgoods[i]["Uraian"],
          value: this.costofgoods[i]["Nilai"]
        };
        this.axios.post(address + ':3000/add-harga-pokok', postObj, headers)
        .then((response) => {
          let query = gql.addCostofgood;
          postObj.costofgood_id = response.data.insertId;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            
          });
        });
      }
    },
    // fetchSumberPembiayaan() {
    //   var id = this.$session.get('user').user_id;
    //   var lastReport = this.reports[this.reports.length-1];
    //   this.axios.get(address + ":3000/get-laba-rugi", headers).then((response) => {
    //     let query = gql.allBalance;
    //     graphqlFunction.graphqlFetchAll(query, (result) => {
    //       for(var i = 0; i < result.balances.length; i++) {
    //         if(result.balances[i].report_id == lastReport.report_id) {
    //           this.balances.push({
    //             'balance_id': result.balances[i].balance_id,
    //             'report_id': result.balances[i].report_id,
    //             'Kategori': result.balances[i].category,
    //             'Sub-Kategori': result.balances[i].sub_category,
    //             'Uraian': result.balances[i].detail,
    //             'Nilai': result.balances[i].value,
    //           });
    //         }
    //       }
    //     });
    //   })
    // },
    addSumberPembiayaan(report_id) {
      for(var i = 0; i < this.source_of_financings.length; i++) {
        let postObj = {
          report_id: report_id,
          detail: this.source_of_financings[i]["Uraian"],
          value: this.source_of_financings[i]["Nilai"]
        };
        this.axios.post(address + ':3000/add-sumber-pembiayaan', postObj, headers)
        .then((response) => {
          let query = gql.addSourceOfFinancing;
          postObj.source_of_financing_id = response.data.insertId;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            
          });
        });
      }
    },
    // fetchInvestasi() {
    //   var id = this.$session.get('user').user_id;
    //   var lastReport = this.reports[this.reports.length-1];
    //   this.axios.get(address + ":3000/get-laba-rugi", headers).then((response) => {
    //     let query = gql.allBalance;
    //     graphqlFunction.graphqlFetchAll(query, (result) => {
    //       for(var i = 0; i < result.balances.length; i++) {
    //         if(result.balances[i].report_id == lastReport.report_id) {
    //           this.balances.push({
    //             'balance_id': result.balances[i].balance_id,
    //             'report_id': result.balances[i].report_id,
    //             'Kategori': result.balances[i].category,
    //             'Sub-Kategori': result.balances[i].sub_category,
    //             'Uraian': result.balances[i].detail,
    //             'Nilai': result.balances[i].value,
    //           });
    //         }
    //       }
    //     });
    //   })
    // },
    addInvestasi(report_id) {
      for(var i = 0; i < this.investments.length; i++) {
        let postObj = {
          report_id: report_id,
          detail: this.investments[i]["Uraian"],
          value: this.investments[i]["Nilai"]
        };
        this.axios.post(address + ':3000/add-investasi', postObj, headers)
        .then((response) => {
          let query = gql.addInvestment;
          postObj.investment_id = response.data.insertId;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            
          });
        });
      }
    },
    // fetchKeuanganLainnya() {
    //   var id = this.$session.get('user').user_id;
    //   var lastReport = this.reports[this.reports.length-1];
    //   this.axios.get(address + ":3000/get-laba-rugi", headers).then((response) => {
    //     let query = gql.allBalance;
    //     graphqlFunction.graphqlFetchAll(query, (result) => {
    //       for(var i = 0; i < result.balances.length; i++) {
    //         if(result.balances[i].report_id == lastReport.report_id) {
    //           this.balances.push({
    //             'balance_id': result.balances[i].balance_id,
    //             'report_id': result.balances[i].report_id,
    //             'Kategori': result.balances[i].category,
    //             'Sub-Kategori': result.balances[i].sub_category,
    //             'Uraian': result.balances[i].detail,
    //             'Nilai': result.balances[i].value,
    //           });
    //         }
    //       }
    //     });
    //   })
    // },
    addKeuanganLainnya(report_id) {
      for(var i = 0; i < this.other_finances.length; i++) {
        let postObj = {
          report_id: report_id,
          detail: this.other_finances[i]["Uraian"],
          value: this.other_finances[i]["Nilai"]
        };
        this.axios.post(address + ':3000/add-keuangan-lainnya', postObj, headers)
        .then((response) => {
          let query = gql.addOtherFinance;
          postObj.other_finance_id = response.data.insertId;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            
          });
        });
      }
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