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
      reports: [],
      national_incomes: [],
      showNationalIncome: [],
      years: [],
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
          }
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
          this.fetchPenerimaanNegara(() => {
            this.mountChart();
          });
        });
      })
    },
    fetchPenerimaanNegara(cb) {
      var id = parseInt(window.location.href.split("?id=")[1]);
      this.axios.get(address + ":3000/get-penerimaan-negara", headers).then((response) => {
        let query = gql.allNationalIncome;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          for(var j = 0; j < this.reports.length; j++) {
            for(var i = 0; i < result.national_incomes.length; i++) {
              if(this.reports[j].report_id == result.national_incomes[i].report_id) {
                if(result.national_incomes[i].detail == 'Royalti' ||
                  result.national_incomes[i].detail == 'Deadrent' ||
                  result.national_incomes[i].detail == 'Pajak-pajak daerah' ||
                  result.national_incomes[i].detail == 'Jumlah Pajak') {
                  result.national_incomes[i].year = this.reports[j].year;
                  this.national_incomes.push(result.national_incomes[i]);
                }
              }
            }
          }
          for(var k = 0; k < this.chartData.datasets.length; k++) {
            for(var i = 0; i < this.years.length; i++) {
              for(var j = 0; j < this.national_incomes.length; j++) {
                if(this.years[i] == this.national_incomes[j].year) {
                  if(this.chartData.datasets[k].label == 'Royalti') {
                    if(this.national_incomes[j]['detail'] == 'Royalti') {
                      this.chartData.datasets[k].data.push(this.national_incomes[j]['value']);
                    }
                  }
                  if(this.chartData.datasets[k].label == 'Deadrent') {
                    if(this.national_incomes[j]['detail'] == 'Deadrent') {
                      this.chartData.datasets[k].data.push(this.national_incomes[j]['value']);
                    }
                  }
                  if(this.chartData.datasets[k].label == 'Jumlah Pajak') {
                    if(this.national_incomes[j]['detail'] == 'Jumlah Pajak') {
                      this.chartData.datasets[k].data.push(this.national_incomes[j]['value']);
                    }
                  }
                  if(this.chartData.datasets[k].label == 'Pajak Daerah') {
                    if(this.national_incomes[j]['detail'] == 'Pajak-pajak daerah') {
                      this.chartData.datasets[k].data.push(this.national_incomes[j]['value']);
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

