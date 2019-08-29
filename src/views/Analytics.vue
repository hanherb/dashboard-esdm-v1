<template>
  <d-container fluid class="main-content-container px-4">

    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">

      <!-- Page Header - Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">Overview</span>
        <h3 class="page-title">Analytics</h3>
      </d-col>

      <!-- Page Header - Datepicker -->
      <!-- <d-col sm="4" class="d-flex">
        <d-input-group size="sm" class="d-flex justify-content-end my-auto date-range">
          <d-datepicker v-model="dateRange.from" :highlighted="{ from: dateRange.from, to: dateRange.to || new Date() }" typeable placeholder="Start date" small />
          <d-datepicker v-model="dateRange.to" :highlighted="{ from: dateRange.from, to: dateRange.to || new Date() }" typeable placeholder="End date" small />
          <d-input-group-text slot="append">
            <i class="material-icons">&#xE916;</i>
          </d-input-group-text>
        </d-input-group>
      </d-col> -->

    </d-row>

    <!-- Small Stats Blocks -->
    <d-row>
      <d-col v-for="(stats, idx) in smallStats" :key="idx" md="6" lg="3" class="mb-4">
        <small-stats :id="`small-stats-${idx}`" :chart-data="stats.datasets" :label="stats.label" :value="stats.value" :percentage="stats.percentage" :increase="stats.increase" :decrease="stats.decrease" />
      </d-col>
    </d-row>

    <hr>
  
    <ao-summary-card />

    <!-- <d-row> -->
      <!-- Sessions -->
      <!-- <d-col lg="8" md="12" sm="12" class="mb-4">
        <ao-sessions />
      </d-col> -->

      <!-- Users by Device -->
      <!-- <d-col lg="4" md="6" sm="6" class="mb-4">
        <ao-users-by-device />
      </d-col> -->

      <!-- Goals Overview -->
      <!-- <d-col lg="5" class="mb-4">
        <ao-goals-overview />
      </d-col>
    </d-row> -->
  </d-container>
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';
import SmallStats from '@/components/common/SmallStats.vue';
import Sessions from '@/components/analytics/Sessions.vue';
import UsersByDevice from '@/components/analytics/UsersByDevice.vue';
import GoalsOverview from '@/components/analytics/GoalsOverview/GoalsOverview.vue';
import SummaryCard from '@/components/analytics/SummaryCard.vue';
import KomoditasGroup from '@/data/komoditas-group.json';

import colors from '../utils/colors';

export default {
  name: 'analytics',
  components: {
    SmallStats,
    aoSessions: Sessions,
    aoUsersByDevice: UsersByDevice,
    aoGoalsOverview: GoalsOverview,
    aoSummaryCard: SummaryCard,
  },
  data() {
    return {
      dateRange: {
        from: null,
        to: null,
      },
      users: [],
      komoditasGroup: KomoditasGroup,
      komoditasCard: [],
      totalAset: [],
      totalPenjualan: [],
      totalAsetEksplorasi: [],
      totalDER: [],
      totalNPM: [],
      activeCard: "totalAset",
    };
  },
  computed: {
    // Small Stats Components Data
/*     smallStats() {
      return [{
        label: 'Users',
        value: this.users.length,
        percentage: '12.4%',
        increase: true,
        decrease: false,
        datasets: [{
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: colors.primary.toRGBA(0.1),
          borderColor: colors.primary.toRGBA(),
          data: [9, 3, 3, 9, 9],
        }],
      }, {
        label: 'Sessions',
        value: '8,391',
        percentage: '7.21%',
        increase: false,
        decrease: true,
        datasets: [{
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: colors.success.toRGBA(0.1),
          borderColor: colors.success.toRGBA(),
          data: [3.9, 4, 4, 9, 4],
        }],
      }, {
        label: 'Pageviews',
        value: '21,293',
        percentage: '3.71%',
        increase: true,
        decrease: false,
        datasets: [{
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: colors.warning.toRGBA(0.1),
          borderColor: colors.warning.toRGBA(),
          data: [6, 6, 9, 3, 3],
        }],
      }, {
        label: 'Pages/Session',
        value: '6.43',
        percentage: '2.71%',
        increase: false,
        decrease: true,
        datasets: [{
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: colors.salmon.toRGBA(0.1),
          borderColor: colors.salmon.toRGBA(),
          data: [0, 9, 3, 3, 3],
        }],
      }];
    }, */
    komoditasStats() {
      return this.komoditasCard;
    },
  },

  created: function()
  {
    this.fetchUsers();
    this.createKomoditasCard();
    this.calculateSummary();
  },

  methods: {
    fetchUsers() {
      this.axios.get(address + ":3000/get-user", headers).then((response) => {
        let query = `query getAllUser {
          users {
            _id
            fullname
            email
            role
            authority
          }
        }`;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          this.users = result.users;
        });
      })
    },
    fetchKomoditasGroup(komoditas) {
      var arrKeys = Object.keys(this.komoditasGroup);
      for(var i = 0; i < arrKeys.length; i++) {
        for(var j = 0; j < this.komoditasGroup[arrKeys[i]].length; j++) {
          if(this.komoditasGroup[arrKeys[i]][j] == komoditas.toLowerCase()) {
              return arrKeys[i];
          }
        }
      }
    },
    createKomoditasCard() {
      var arrKeys = Object.keys(this.komoditasGroup);
      for(var i = 0; i < arrKeys.length; i++) {
        this.komoditasCard.push({
          label: arrKeys[i],
          value: {
            totalAset: 0,
            totalPenjualan: 0,
            totalAsetEksplorasi: 0,
            totalDER: 0,
            totalNPM: 0,
          },
          percentage: '0',
          increase: true,
          decrease: false,
          datasets: [{
            label: 'Today',
            fill: 'start',
            borderWidth: 1.5,
            backgroundColor: colors.primary.toRGBA(0.1),
            borderColor: colors.primary.toRGBA(),
            data: [0, 0, 0, 0, 0],
          }],
        });
      }
    },
    fillKomoditasCard() {
      for(var i = 0; i < this.komoditasCard.length; i++) {
        for(var j = 0; j < this.totalAset.length; j++) {
          if(this.komoditasCard[i].label == this.totalAset[j].komoditas) {
            this.komoditasCard[i].value.totalAset = this.totalAset[j].value;  
          }
        }
        for(var j = 0; j < this.totalPenjualan.length; j++) {
          if(this.komoditasCard[i].label == this.totalPenjualan[j].komoditas) {
            this.komoditasCard[i].value.totalPenjualan = this.totalPenjualan[j].value;  
          }
        }
        for(var j = 0; j < this.totalAsetEksplorasi.length; j++) {
          if(this.komoditasCard[i].label == this.totalAsetEksplorasi[j].komoditas) {
            this.komoditasCard[i].value.totalAsetEksplorasi = this.totalAsetEksplorasi[j].value;  
          }
        }
        for(var j = 0; j < this.totalDER.length; j++) {
          if(this.komoditasCard[i].label == this.totalDER[j].komoditas) {
            this.komoditasCard[i].value.totalDER = this.totalDER[j].value;  
          }
        }
        for(var j = 0; j < this.totalNPM.length; j++) {
          if(this.komoditasCard[i].label == this.totalNPM[j].komoditas) {
            this.komoditasCard[i].value.totalNPM = this.totalNPM[j].value;  
          }
        }
      }
    },
    toggleCard(id) {
      var btn = document.getElementById("btn-group-filter");
      var btns = document.getElementsByClassName("btn");
      for(var i = 0; i < btns.length; i++) {
        if(btns[i] != id) {
          btns[i].classList.remove("active");
        }
      }
      document.getElementById(id).classList.add("active");
      this.activeCard = id;
    },
    calculateSummary() {
      this.axios.get(address + ":3000/get-neraca", headers).then((response) => {
        for(var i = 0; i < response.data.length; i++) {
          var aktivaLancar = 0;
          var aktivaTidakLancar = 0;
          var jumlahKewajiban = 0;
          var ekuitas = 0;
          var totalAsetEksplorasi = 0;
          var komoditas = this.fetchKomoditasGroup(response.data[i].komoditas);
          for(var j = 0; j < response.data[i].data.length; j++) {
            if(response.data[i].data[j]["URAIAN"] == "Jumlah Aktiva Lancar") {
              aktivaLancar += response.data[i].data[j]["REALISASI TAHUN 2018"];
            }
            else if(response.data[i].data[j]["URAIAN"] == "Jumlah Aktiva Tidak Lancar") {
              aktivaTidakLancar += response.data[i].data[j]["REALISASI TAHUN 2018"];
            }
            else if(response.data[i].data[j]["URAIAN"] == "Aktiva Eksplorasi dan Evaluasi") {
              totalAsetEksplorasi += response.data[i].data[j]["REALISASI TAHUN 2018"];
            }
            else if(response.data[i].data[j]["URAIAN"] == "Jumlah Kewajiban") {
              jumlahKewajiban += response.data[i].data[j]["REALISASI TAHUN 2018"];
            }
            else if(response.data[i].data[j]["URAIAN"] == "Ekuitas") {
              ekuitas += response.data[i].data[j]["REALISASI TAHUN 2018"];
            }
          }
          if(this.totalAset.length == 0) {
            this.totalAset.push({
              "komoditas": komoditas,
              "value": aktivaLancar + aktivaTidakLancar
            });    
          }
          else {
            for(var j = 0; j < this.totalAset.length; j++) {
              if(this.totalAset[j].komoditas == komoditas) {
                this.totalAset[j].value += aktivaLancar + aktivaTidakLancar;
                break;
              }
              if(j == this.totalAset.length-1) {
                this.totalAset.push({
                  "komoditas": komoditas,
                  "value": aktivaLancar + aktivaTidakLancar
                });
                break;
              }
            }
          }
          if(this.totalDER.length == 0) {
            this.totalDER.push({
              "komoditas": komoditas,
              "value": jumlahKewajiban / ekuitas
            });    
          }
          else {
            for(var j = 0; j < this.totalDER.length; j++) {
              if(this.totalDER[j].komoditas == komoditas) {
                this.totalDER[j].value += jumlahKewajiban / ekuitas;
                break;
              }
              if(j == this.totalDER.length-1) {
                this.totalDER.push({
                  "komoditas": komoditas,
                  "value": jumlahKewajiban / ekuitas
                });
                break;
              }
            }
          }
          if(this.totalAsetEksplorasi.length == 0) {
            this.totalAsetEksplorasi.push({
              "komoditas": komoditas,
              "value": totalAsetEksplorasi
            });    
          }
          else {
            for(var j = 0; j < this.totalAsetEksplorasi.length; j++) {
              if(this.totalAsetEksplorasi[j].komoditas == komoditas) {
                this.totalAsetEksplorasi[j].value += totalAsetEksplorasi
                break;
              }
              if(j == this.totalAsetEksplorasi.length-1) {
                this.totalAsetEksplorasi.push({
                  "komoditas": komoditas,
                  "value": totalAsetEksplorasi
                });
                break;
              }
            }
          }
        }
      });

      this.axios.get(address + ":3000/get-laba-rugi", headers).then((response) => {
        for(var i = 0; i < response.data.length; i++) {
          var penjualan = 0;
          var labaBersih = 0;
          var komoditas = this.fetchKomoditasGroup(response.data[i].komoditas);
          for(var j = 0; j < response.data[i].data.length; j++) {
            if(response.data[i].data[j]["URAIAN"] == "Penjualan") {
              penjualan += response.data[i].data[j]["REALISASI TAHUN 2018"];
            }
            else if(response.data[i].data[j]["URAIAN"] == "Laba/ (Rugi) Bersih") {
              labaBersih += response.data[i].data[j]["REALISASI TAHUN 2018"];
            }
          }

          if(this.totalPenjualan.length == 0) {
            this.totalPenjualan.push({
              "komoditas": komoditas,
              "value": penjualan
            });    
          }
          else {
            for(var j = 0; j < this.totalPenjualan.length; j++) {
              if(this.totalPenjualan[j].komoditas == komoditas) {
                this.totalPenjualan[j].value += penjualan
                break;
              }
              if(j == this.totalPenjualan.length-1) {
                this.totalPenjualan.push({
                  "komoditas": komoditas,
                  "value": penjualan
                });
                break;
              }
            }
          }
          if(this.totalNPM.length == 0) {
            this.totalNPM.push({
              "komoditas": komoditas,
              "value": labaBersih / penjualan
            });    
          }
          else {
            for(var j = 0; j < this.totalNPM.length; j++) {
              if(this.totalNPM[j].komoditas == komoditas) {
                this.totalNPM[j].value += labaBersih / penjualan
                break;
              }
              if(j == this.totalNPM.length-1) {
                this.totalNPM.push({
                  "komoditas": komoditas,
                  "value": labaBersih / penjualan
                });
                break;
              }
            }
          }
        }
        this.fillKomoditasCard();
      });
    }
  }
};
</script>

<style scoped>
  .komoditas-card {

  }
</style>
