<template>
  <d-card class="card-small mb-4">
    <!-- Card Header -->
    <d-card-header class="border-bottom">
      <h6 class="m-0">{{ title }}</h6>
      <div class="block-handle"></div>
    </d-card-header>

    <d-card-body class="pt-0">
      <!-- <d-row class="border-bottom py-2 bg-light">
        <d-col col sm="6" class="d-flex mb-2 mb-sm-0">
          <d-button-group>
            <d-btn class="btn-white" active>Hour</d-btn>
            <d-btn class="btn-white">Day</d-btn>
            <d-btn class="btn-white">Week</d-btn>
            <d-btn class="btn-white">Month</d-btn>
          </d-button-group>
        </d-col>

        <d-col col sm="6">
          <d-input-group size="sm" class="date-range d-flex justify-content-end">
            <d-datepicker
              v-model="dateRange.from"
              :highlighted="{ from: dateRange.from, to: dateRange.to || new Date() }"
              placeholder="Start date"
              small
              typeable
            />
            <d-datepicker
              v-model="dateRange.to"
              :highlighted="{ from: dateRange.from, to: dateRange.to || new Date() }"
              placeholder="End date"
              small
              typeable
            />
            <d-input-group-text slot="append">
              <i class="material-icons">&#xE916;</i>
            </d-input-group-text>
          </d-input-group>
        </d-col>
      </d-row> -->

      <!-- Chart -->
      <div ref="legend"></div>
      <canvas
        height="120"
        ref="canvas"
        style="max-width: 100% !important;"
        class="analytics-overview-sessions"
      ></canvas>
    </d-card-body>
  </d-card>
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';
import colors from '../../utils/colors';
import Chart from '../../utils/chart';

const defaultChartData = {
  
};

export default {
  name: 'laba-rugi-chart',
  props: {
    /**
     * The component title.
     */
    title: {
      type: String,
      default: 'Chart Laba Rugi',
    },
    /**
     * The Chart.js data.
     */
    // chartData: {
    //   type: Object,
    //   default() {
    //     return defaultChartData;
    //   },
    // },
    /**
     * The Chart.js options.
     */
    chartOptions: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      dateRange: {
        from: null,
        to: null,
      },
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Penjualan',
            fill: 'start',
            data: [],
            backgroundColor: colors.primary.toRGBA(0.1),
            borderColor: colors.primary.toRGBA(1),
            pointBackgroundColor: colors.white.toHex(),
            pointHoverBackgroundColor: colors.primary.toRGBA(1),
            borderWidth: 1.5,
          },
          {
            label: 'HPP',
            fill: 'start',
            data: [],
            backgroundColor: colors.salmon.toRGBA(0.1),
            borderColor: colors.salmon.toRGBA(1),
            pointBackgroundColor: colors.white.toHex(),
            pointHoverBackgroundColor: colors.salmon.toRGBA(1),
            borderWidth: 1.5,
          },
          {
            label: 'Beban Operasi',
            fill: 'start',
            data: [],
            backgroundColor: colors.green.toRGBA(0.1),
            borderColor: colors.green.toRGBA(1),
            pointBackgroundColor: colors.white.toHex(),
            pointHoverBackgroundColor: colors.green.toRGBA(1),
            borderWidth: 1.5,
          },
          {
            label: 'Pajak Penghasilan',
            fill: 'start',
            data: [],
            backgroundColor: colors.yellow.toRGBA(0.1),
            borderColor: colors.yellow.toRGBA(1),
            pointBackgroundColor: colors.white.toHex(),
            pointHoverBackgroundColor: colors.yellow.toRGBA(1),
            borderWidth: 1.5,
          },
          {
            label: 'Laba Bersih',
            fill: 'start',
            data: [],
            backgroundColor: colors.purple.toRGBA(0.1),
            borderColor: colors.purple.toRGBA(1),
            pointBackgroundColor: colors.white.toHex(),
            pointHoverBackgroundColor: colors.purple.toRGBA(1),
            borderWidth: 1.5,
          },
        ],
      }
    };
  },

  created: function()
  {
    this.fetchLabaRugi(() => {
      this.mountChart();
    });
  },

  methods: {
    fetchLabaRugi(cb) {
      var id = window.location.href.split("?id=")[1];
      this.axios.get(address + ":3000/get-laba-rugi", headers).then((response) => {
        for(let i = 0; i < response.data.length; i++) {
          if(response.data[i].upload_by == id) {
            var keys = Object.keys(response.data[i].data[0]);
            for(var k = 0; k < keys.length; k++) {
              if(keys[k].split(' ')[0] == "REALISASI") {
                this.chartData.labels.push(keys[k].split('REALISASI TAHUN ')[1]);
              }
            }
            var tempTahun = [];
            for(var k = this.chartData.labels[0]; k <= this.chartData.labels[this.chartData.labels.length-1]; k++) {
              var temp = {};
              for(let j = 0; j < response.data[i].data.length; j++) {
                if(response.data[i].data[j]["URAIAN"] == "Penjualan") {
                  temp["Penjualan"] = response.data[i].data[j]["REALISASI TAHUN " + k];
                }
                if(response.data[i].data[j]["URAIAN"] == "Harga Pokok Penjualan") {
                  temp["Harga Pokok Penjualan"] = response.data[i].data[j]["REALISASI TAHUN " + k];
                }
                if(response.data[i].data[j]["URAIAN"] == "Jumlah Beban Operasi") {
                  temp["Jumlah Beban Operasi"] = response.data[i].data[j]["REALISASI TAHUN " + k];
                }
                if(response.data[i].data[j]["URAIAN"] == "Biaya Pajak Penghasilan") {
                  temp["Biaya Pajak Penghasilan"] = response.data[i].data[j]["REALISASI TAHUN " + k];
                }
                if(response.data[i].data[j]["URAIAN"] == "Laba/(Rugi) Bersih") {
                  temp["Laba/(Rugi) Bersih"] = response.data[i].data[j]["REALISASI TAHUN " + k];
                }
              }
              tempTahun.push(temp);
            }

            for(var k = 0; k < this.chartData.datasets.length; k++) {
              for(var j = 0; j < tempTahun.length; j++) {
                if(this.chartData.datasets[k].label == 'Penjualan') {
                  this.chartData.datasets[k].data.push(tempTahun[j]['Penjualan']);
                }
                if(this.chartData.datasets[k].label == 'HPP') {
                  this.chartData.datasets[k].data.push(tempTahun[j]['Harga Pokok Penjualan']);
                }
                if(this.chartData.datasets[k].label == 'Beban Operasi') {
                  this.chartData.datasets[k].data.push(tempTahun[j]['Jumlah Beban Operasi']);
                }
                if(this.chartData.datasets[k].label == 'Pajak Penghasilan') {
                  this.chartData.datasets[k].data.push(tempTahun[j]['Biaya Pajak Penghasilan']);
                }
                if(this.chartData.datasets[k].label == 'Laba Bersih') {
                  this.chartData.datasets[k].data.push(tempTahun[j]['Laba/(Rugi) Bersih']);
                }
              }
            }
          }
        }
        if(cb)
          return cb();
      });
    },
    mountChart() {
      const chartOptions = {
        ...{
          responsive: true,
          legend: false,
          elements: {
            line: {
              // A higher value makes the line look skewed at this ratio.
              tension: 0.38,
            },
          },
          scales: {
            xAxes: [
              {
                gridLines: false,
                ticks: {
                  callback(tick, index) {
                    return index % 1 ? '' : tick;
                  },
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  suggestedMax: 45,
                },
              },
            ],
          },
          tooltips: {
            enabled: false,
            mode: 'index',
            position: 'nearest',
          },
        },
        ...this.chartOptions,
      };

      const AnalyticsOverviewChart = new Chart(this.$refs.canvas, {
        type: 'line',
        data: this.chartData,
        options: chartOptions,
      });

      // Generate the analytics overview chart labels.
      this.$refs.legend.innerHTML = AnalyticsOverviewChart.generateLegend();

      // Hide initially the first and last analytics overview chart points.
      // They can still be triggered on hover.
      const meta = AnalyticsOverviewChart.getDatasetMeta(0);
      meta.data[0]._model.radius = 0;
      meta.data[this.chartData.datasets[0].data.length - 1]._model.radius = 0;

      // Render the chart.
      AnalyticsOverviewChart.render();
    }
  },
};
</script>

