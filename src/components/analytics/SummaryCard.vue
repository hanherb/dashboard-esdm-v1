<template>
  <d-container fluid class="main-content-container px-4">
    <d-button-group size="small" class="d-inline-flex mb-3 mb-sm-0 ml-0" id="btn-group-filter">
      <a tag="button" class="btn btn-white active" id="totalAset" v-on:click="toggleCard($event.currentTarget.id)">Total Aset</a>
      <a tag="button" class="btn btn-white" id="totalPenjualan" v-on:click="toggleCard($event.currentTarget.id)">Total Penjualan</a>
      <a tag="button" class="btn btn-white" id="totalAsetEksplorasi" v-on:click="toggleCard($event.currentTarget.id)">Total Aset Eksplorasi</a>
      <a tag="button" class="btn btn-white" id="totalDER" v-on:click="toggleCard($event.currentTarget.id)">AVG DER</a>
      <a tag="button" class="btn btn-white" id="totalNPM" v-on:click="toggleCard($event.currentTarget.id)">AVG NPM</a>
    </d-button-group>

    <div class="komoditas-card">
      <br>
      <d-row>
        <d-col v-for="(stats, idx) in komoditasStats" :key="idx" md="6" lg="3" class="mb-4">
          <small-stats v-if="activeCard == 'totalAset'" :id="`small-stats-${idx}`" :chart-data="stats.datasets" :label="stats.label" :value="stats.value.totalAset" :percentage="stats.percentage" :increase="stats.increase" :decrease="stats.decrease" variation="1"/>
          <small-stats v-if="activeCard == 'totalPenjualan'" :id="`small-stats-${idx}`" :chart-data="stats.datasets" :label="stats.label" :value="stats.value.totalPenjualan" :percentage="stats.percentage" :increase="stats.increase" :decrease="stats.decrease" variation="1" />
          <small-stats v-if="activeCard == 'totalAsetEksplorasi'" :id="`small-stats-${idx}`" :chart-data="stats.datasets" :label="stats.label" :value="stats.value.totalAsetEksplorasi" :percentage="stats.percentage" :increase="stats.increase" :decrease="stats.decrease" variation="1" />
          <small-stats v-if="activeCard == 'totalDER'" :id="`small-stats-${idx}`" :chart-data="stats.datasets" :label="stats.label" :value="stats.value.totalDER" :percentage="stats.percentage" :increase="stats.increase" :decrease="stats.decrease" variation="1" />
          <small-stats v-if="activeCard == 'totalNPM'" :id="`small-stats-${idx}`" :chart-data="stats.datasets" :label="stats.label" :value="stats.value.totalNPM" :percentage="stats.percentage" :increase="stats.increase" :decrease="stats.decrease" variation="1" />
        </d-col>
      </d-row>
    </div>
  </d-container>
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';
import SmallStats from '@/components/common/SmallStats.vue';
import Sessions from '@/components/analytics/Sessions.vue';
import KomoditasGroup from '@/data/komoditas-group.json';

import colors from '@/utils/colors';

export default {
  name: 'analytics',
  components: {
    SmallStats,
  },
  data() {
    return {
      dateRange: {
        from: null,
        to: null,
      },
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
    komoditasStats() {
      return this.komoditasCard;
    },
  },

  created: function()
  {
    this.createKomoditasCard();
    this.calculateSummary();
  },

  methods: {
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
