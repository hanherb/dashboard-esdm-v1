<template>
  <d-card class="card-small">
    <!-- Card Header -->
    <d-card-header class="border-bottom">
      <h6 class="m-0">{{ title }}</h6>
      <div class="block-handle"></div>
    </d-card-header>

    <d-card-body class="pt-0">
      <!-- <d-row class="border-bottom py-2 bg-light">
        Time Frame
        <d-col col sm="6" class="d-flex mb-2 mb-sm-0">
          <d-button-group>
            <d-btn class="btn-white" active>Hour</d-btn>
            <d-btn class="btn-white">Day</d-btn>
            <d-btn class="btn-white">Week</d-btn>
            <d-btn class="btn-white">Month</d-btn>
          </d-button-group>
        </d-col>

        Date Range
        <d-col col sm="6">
          <d-input-group size="sm" class="date-range d-flex justify-content-end">
            <d-datepicker
              v-model="dateRange.from"
              :highlighted="{ from: dateRange.from, to: dateRange.to || new Date() }"
              placeholder="Start Date"
              small
              typeable
            />
            <d-datepicker
              v-model="dateRange.to"
              :highlighted="{ from: dateRange.from, to: dateRange.to || new Date() }"
              placeholder="End Date"
              small
              typeable
            />
            <d-input-group-text slot="append">
              <i class="material-icons">&#xE916;</i>
            </d-input-group-text>
          </d-input-group>
        </d-col>
      </d-row> -->

      <!-- Legend & Chart -->
      <div ref="legend"></div>
      <canvas
        height="120"
        ref="canvas"
        style="max-width: 100% !important;"
        class="sales-overview-sales-report"
      ></canvas>
    </d-card-body>
  </d-card>
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';
import Chart from '../../utils/chart';

const defaultSalesData = {
  
};

export default {
  name: 'chart-barang',
  props: {
    /**
     * The component title.
     */
    title: {
      type: String,
      default: 'Chart Belanja Barang',
    },
    /**
     * The Chart.js data.
     */
    // chartData: {
    //   type: Object,
    //   default() {
    //     return defaultSalesData;
    //   },
    // },
    /**
     * The Chart.js options.
     */
    chartOptions: {
      type: Object,
      default() {
        return Object.create(null);
      },
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
            label: 'Local',
            fill: 'start',
            data: [],
            backgroundColor: 'rgba(0, 123, 255, 1)',
            borderColor: 'rgba(0, 123, 255, 1)',
            pointBackgroundColor: '#FFFFFF',
            pointHoverBackgroundColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1.5,
          },
          {
            label: 'Import',
            fill: 'start',
            data: [],
            backgroundColor: 'rgb(250, 128, 114)',
            borderColor: 'rgb(250, 128, 114)',
            pointBackgroundColor: '#FFFFFF',
            pointHoverBackgroundColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1.5,
          },
        ],
      }
    };
  },

  created: function()
  {
    this.fetchBelanjaBarang(() => {
      this.mountChart();
    });
  },

  methods: {
    fetchBelanjaBarang(cb) {
      var id = window.location.href.split("?id=")[1];
      this.axios.get(address + ":3000/get-belanja-barang", headers).then((response) => {
        var tempTotal = [];
        for(let i = 0; i < response.data.length; i++) {
          if(response.data[i].upload_by == id) {
            if(response.data[i].data[0]["Rencana/Realisasi"] == "Realisasi") {
              var tahun = response.data[i].data[0]["Tahun"];
              if(!this.chartData.labels.includes(tahun)) {
                this.chartData.labels.push(tahun);
                this.chartData.labels.sort(function(a, b){return a-b});
              }
              var temp = {
                "Local": 0,
                "Import": 0,
                "Year": tahun
              };
              for(let j = 0; j < response.data[i].data.length; j++) {
                if(response.data[i].data[j]["Nasional"]) {
                  temp["Local"] += response.data[i].data[j]["Total Price (US$)"];
                }
                else if(response.data[i].data[j]["Provinsi"]) {
                  temp["Local"] += response.data[i].data[j]["Total Price (US$)"];
                }
                else if(response.data[i].data[j]["Kabupaten"]) {
                  temp["Local"] += response.data[i].data[j]["Total Price (US$)"];
                }
                else if(response.data[i].data[j]["Negara"]) {
                  temp["Import"] += response.data[i].data[j]["Total Price (US$)"];
                }
              }
              tempTotal.push(temp);
            }
          }
        }
        for(var i = 0; i < this.chartData.datasets.length; i++) {
          for(var k = this.chartData.labels[0]; k <= this.chartData.labels[this.chartData.labels.length-1]; k++) {
            var tempLocal = 0;
            var tempImport = 0;
            for(var j = 0; j < tempTotal.length; j++) {
              if(tempTotal[j]["Year"] == k) {
                tempLocal += tempTotal[j]['Local'];
                tempImport += tempTotal[j]['Import'];
              }
            }
            if(this.chartData.datasets[i].label == 'Local') {
              this.chartData.datasets[i].data.push(tempLocal);
            }
            if(this.chartData.datasets[i].label == 'Import') {
              this.chartData.datasets[i].data.push(tempImport);
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
          legend: false,
          // Uncomment the following line in order to disable the animations.
          // animation: false,
          tooltips: {
            enabled: false,
            mode: 'index',
            position: 'nearest',
          },
          scales: {
            xAxes: [
              {
                stacked: false,
                gridLines: false,
              },
            ],
            yAxes: [
              {
                stacked: false,
                ticks: {
                  userCallback(label) {
                    return label > 999 ? `${(label / 1000).toFixed(0)}k` : label;
                  },
                },
              },
            ],
          },
        },
        ...this.chartOptions,
      };

      const SalesReportChart = new Chart(this.$refs.canvas, {
        type: 'bar',
        data: this.chartData,
        options: chartOptions,
      });

      // Generate the chart labels.
      this.$refs.legend.innerHTML = SalesReportChart.generateLegend();

      // Hide initially the first and last chart points.
      // They can still be triggered on hover.
      const meta = SalesReportChart.getDatasetMeta(0);
      meta.data[0]._model.radius = 0;
      meta.data[this.chartData.datasets[0].data.length - 1]._model.radius = 0;

      // Render the chart.
      SalesReportChart.render();
    },
  },
};
</script>

