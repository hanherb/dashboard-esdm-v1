<template>
  <d-card class="card-small mb-4">
    <!-- Card Header -->
    <d-card-header class="border-bottom">
      <h6 class="m-0">{{ title }}</h6>
      <div class="block-handle"></div>
    </d-card-header>

    <d-card-body class="pt-0">
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
import gql from '@/gql';
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
      reports: [],
      profit_losses: [],
      showProfitLoss: [],
      years: [],
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
    this.fetchReport();
  },

  methods: {
    fetchReport() {
      var id = parseInt(window.location.href.split("?id=")[1]);
      this.axios.get(address + ":3000/get-report", headers).then((response) => {
        let query = gql.allReport;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          for(var i = 0; i < result.reports.length; i++) {
            if(result.reports[i].user_id == id) {
              this.reports.push(result.reports[i]);
              if(!this.years.includes(this.reports[i].year)) {
                this.years.push(this.reports[i].year);
                this.years.sort(function(a, b){return a-b});
                this.chartData.labels = this.years;
              }
            }
          }
          this.fetchLabaRugi(() => {
            this.mountChart();
          });
        });
      })
    },
    fetchLabaRugi(cb) {
      var id = parseInt(window.location.href.split("?id=")[1]);
      this.axios.get(address + ":3000/get-laba-rugi", headers).then((response) => {
        let query = gql.allProfitLoss;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          for(var j = 0; j < this.reports.length; j++) {
            for(var i = 0; i < result.profit_losses.length; i++) {
              if(this.reports[j].report_id == result.profit_losses[i].report_id) {
                if(result.profit_losses[i].detail == 'Penjualan' ||
                  result.profit_losses[i].detail == 'Harga Pokok Penjualan' ||
                  result.profit_losses[i].detail == 'Beban Operasi' ||
                  result.profit_losses[i].detail == 'Biaya Pajak Penghasilan' ||
                  result.profit_losses[i].detail == 'Laba Rugi Bersih') {
                  result.profit_losses[i].year = this.reports[j].year;
                  this.profit_losses.push(result.profit_losses[i]);
                }
              }
            }
          }
          for(var k = 0; k < this.chartData.datasets.length; k++) {
            for(var i = 0; i < this.years.length; i++) {
              for(var j = 0; j < this.profit_losses.length; j++) {
                if(this.years[i] == this.profit_losses[j].year) {
                  if(this.chartData.datasets[k].label == 'Penjualan') {
                    if(this.profit_losses[j]['detail'] == 'Penjualan') {
                      this.chartData.datasets[k].data.push(this.profit_losses[j]['value']);
                    }
                  }
                  if(this.chartData.datasets[k].label == 'HPP') {
                    if(this.profit_losses[j]['detail'] == 'Harga Pokok Penjualan') {
                      this.chartData.datasets[k].data.push(this.profit_losses[j]['value']);
                    }
                  }
                  if(this.chartData.datasets[k].label == 'Beban Operasi') {
                    if(this.profit_losses[j]['detail'] == 'Beban Operasi') {
                      this.chartData.datasets[k].data.push(this.profit_losses[j]['value']);
                    }
                  }
                  if(this.chartData.datasets[k].label == 'Pajak Penghasilan') {
                    if(this.profit_losses[j]['detail'] == 'Biaya Pajak Penghasilan') {
                      this.chartData.datasets[k].data.push(this.profit_losses[j]['value']);
                    }
                  }
                  if(this.chartData.datasets[k].label == 'Laba Bersih') {
                    if(this.profit_losses[j]['detail'] == 'Laba Rugi Bersih') {
                      this.chartData.datasets[k].data.push(this.profit_losses[j]['value']);
                    }
                  }
                }
              }
            }
          }
          if(cb)
            return cb();
        });
      })
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

