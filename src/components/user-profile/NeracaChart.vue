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
  name: 'neraca-chart',
  props: {
    /**
     * The component title.
     */
    title: {
      type: String,
      default: 'Chart Neraca',
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
      balances: [],
      showBalance: [],
      years: [],
      dateRange: {
        from: null,
        to: null,
      },
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Aktiva Tetap',
            fill: 'start',
            data: [],
            backgroundColor: colors.primary.toRGBA(0.1),
            borderColor: colors.primary.toRGBA(1),
            pointBackgroundColor: colors.white.toHex(),
            pointHoverBackgroundColor: colors.primary.toRGBA(1),
            borderWidth: 1.5,
          },
          {
            label: 'Jumlah Aktiva',
            fill: 'start',
            data: [],
            backgroundColor: colors.salmon.toRGBA(0.1),
            borderColor: colors.salmon.toRGBA(1),
            pointBackgroundColor: colors.white.toHex(),
            pointHoverBackgroundColor: colors.salmon.toRGBA(1),
            borderWidth: 1.5,
          },
          {
            label: 'Aktiva Eksplorasi',
            fill: 'start',
            data: [],
            backgroundColor: colors.green.toRGBA(0.1),
            borderColor: colors.green.toRGBA(1),
            pointBackgroundColor: colors.white.toHex(),
            pointHoverBackgroundColor: colors.green.toRGBA(1),
            borderWidth: 1.5,
          },
          {
            label: 'Jumlah Kewajiban Jangka Pendek',
            fill: 'start',
            data: [],
            backgroundColor: colors.yellow.toRGBA(0.1),
            borderColor: colors.yellow.toRGBA(1),
            pointBackgroundColor: colors.white.toHex(),
            pointHoverBackgroundColor: colors.yellow.toRGBA(1),
            borderWidth: 1.5,
          },
          {
            label: 'Jumlah Kewajiban Jangka Panjang',
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
          this.fetchNeraca(() => {
            console.log(this.chartData.datasets)
            this.mountChart();
          });
        });
      })
    },
    fetchNeraca(cb) {
      var id = parseInt(window.location.href.split("?id=")[1]);
      this.axios.get(address + ":3000/get-neraca", headers).then((response) => {
        let query = gql.allBalance;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          for(var j = 0; j < this.reports.length; j++) {
            for(var i = 0; i < result.balances.length; i++) {
              if(this.reports[j].report_id == result.balances[i].report_id) {
                if(result.balances[i].detail == 'Aktiva Tetap' ||
                  result.balances[i].detail == 'Jumlah Aktiva' ||
                  result.balances[i].detail == 'Aktiva Eksplorasi' ||
                  result.balances[i].detail == 'Jumlah Kewajiban Jangka Pendek' ||
                  result.balances[i].detail == 'Jumlah Kewajiban Jangka Panjang') {
                  result.balances[i].year = this.reports[j].year;
                  this.balances.push(result.balances[i]);
                }
              }
            }
          }
          for(var k = 0; k < this.chartData.datasets.length; k++) {
            for(var i = 0; i < this.years.length; i++) {
              for(var j = 0; j < this.balances.length; j++) {
                if(this.years[i] == this.balances[j].year) {
                  if(this.chartData.datasets[k].label == 'Aktiva Tetap') {
                    if(this.balances[j]['detail'] == 'Aktiva Tetap') {
                      this.chartData.datasets[k].data.push(this.balances[j]['value']);
                    }
                  }
                  if(this.chartData.datasets[k].label == 'Jumlah Aktiva') {
                    if(this.balances[j]['detail'] == 'Jumlah Aktiva') {
                      this.chartData.datasets[k].data.push(this.balances[j]['value']);
                    }
                  }
                  if(this.chartData.datasets[k].label == 'Aktiva Eksplorasi') {
                    if(this.balances[j]['detail'] == 'Aktiva Eksplorasi') {
                      this.chartData.datasets[k].data.push(this.balances[j]['value']);
                    }
                  }
                  if(this.chartData.datasets[k].label == 'Jumlah Kewajiban Jangka Pendek') {
                    if(this.balances[j]['detail'] == 'Jumlah Kewajiban Jangka Pendek') {
                      this.chartData.datasets[k].data.push(this.balances[j]['value']);
                    }
                  }
                  if(this.chartData.datasets[k].label == 'Jumlah Kewajiban Jangka Panjang') {
                    if(this.balances[j]['detail'] == 'Jumlah Kewajiban Jangka Panjang') {
                      this.chartData.datasets[k].data.push(this.balances[j]['value']);
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
      console.log(meta)
      meta.data[0]._model.radius = 0;
      meta.data[this.chartData.datasets[0].data.length - 1]._model.radius = 0;

      // Render the chart.
      AnalyticsOverviewChart.render();
    }
  },
};
</script>

