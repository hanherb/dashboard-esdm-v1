<template>
  <d-card class="card-small mb-4">
    <!-- Card Header -->
    <d-card-header class="border-bottom">
      <h6 class="m-0">{{ title }}</h6>
      <div class="block-handle"></div>
    </d-card-header>

    <d-card-body class="pt-0">
     <!--  <d-row class="border-bottom py-2 bg-light">
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
  name: 'penerimaan-negara-chart',
  props: {
    /**
     * The component title.
     */
    title: {
      type: String,
      default: 'Chart Penerimaan Negara',
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
            label: 'Royalti',
            fill: 'start',
            data: [],
            backgroundColor: colors.primary.toRGBA(0.1),
            borderColor: colors.primary.toRGBA(1),
            pointBackgroundColor: colors.white.toHex(),
            pointHoverBackgroundColor: colors.primary.toRGBA(1),
            borderWidth: 1.5,
          },
          {
            label: 'Deadrent',
            fill: 'start',
            data: [],
            backgroundColor: colors.salmon.toRGBA(0.1),
            borderColor: colors.salmon.toRGBA(1),
            pointBackgroundColor: colors.white.toHex(),
            pointHoverBackgroundColor: colors.salmon.toRGBA(1),
            borderWidth: 1.5,
          },
          {
            label: 'Jumlah Pajak',
            fill: 'start',
            data: [],
            backgroundColor: colors.green.toRGBA(0.1),
            borderColor: colors.green.toRGBA(1),
            pointBackgroundColor: colors.white.toHex(),
            pointHoverBackgroundColor: colors.green.toRGBA(1),
            borderWidth: 1.5,
          },
          {
            label: 'Pajak Daerah',
            fill: 'start',
            data: [],
            backgroundColor: colors.yellow.toRGBA(0.1),
            borderColor: colors.yellow.toRGBA(1),
            pointBackgroundColor: colors.white.toHex(),
            pointHoverBackgroundColor: colors.yellow.toRGBA(1),
            borderWidth: 1.5,
          },
        ],
      }
    };
  },

  created: function()
  {
    this.fetchPenerimaanNegara(() => {
      this.mountChart();
    });
  },

  methods: {
    fetchPenerimaanNegara(cb) {
      var id = window.location.href.split("?id=")[1];
      this.axios.get(address + ":3000/get-penerimaan-negara", headers).then((response) => {
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
                if(response.data[i].data[j]["URAIAN"] == "Royalti") {
                  temp["Royalti"] = response.data[i].data[j]["REALISASI TAHUN " + k];
                }
                if(response.data[i].data[j]["URAIAN"] == "Deadrent") {
                  temp["Deadrent"] = response.data[i].data[j]["REALISASI TAHUN " + k];
                }
                if(response.data[i].data[j]["URAIAN"] == "Jumlah Pajak") {
                  temp["Jumlah Pajak"] = response.data[i].data[j]["REALISASI TAHUN " + k];
                }
                if(response.data[i].data[j]["URAIAN"] == "Pajak-pajak daerah") {
                  temp["Pajak-pajak daerah"] = response.data[i].data[j]["REALISASI TAHUN " + k];
                }
              }
              tempTahun.push(temp);
            }

            for(var i = 0; i < this.chartData.datasets.length; i++) {
              for(var j = 0; j < tempTahun.length; j++) {
                if(this.chartData.datasets[i].label == 'Royalti') {
                  this.chartData.datasets[i].data.push(tempTahun[j]['Royalti']);
                }
                if(this.chartData.datasets[i].label == 'Deadrent') {
                  this.chartData.datasets[i].data.push(tempTahun[j]['Deadrent']);
                }
                if(this.chartData.datasets[i].label == 'Jumlah Pajak') {
                  this.chartData.datasets[i].data.push(tempTahun[j]['Jumlah Pajak']);
                }
                if(this.chartData.datasets[i].label == 'Pajak Penghasilan') {
                  this.chartData.datasets[i].data.push(tempTahun[j]['Biaya Pajak Penghasilan']);
                }
                if(this.chartData.datasets[i].label == 'Pajak Daerah') {
                  this.chartData.datasets[i].data.push(tempTahun[j]['Pajak-pajak daerah']);
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

