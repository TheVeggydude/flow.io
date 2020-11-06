<template>
  <apexchart
    ref="chart"
    type="line"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script>
export default {
  name: "TimeSeriesChart",
  props: ["series", "title", "xlabel", "ylabel"],

  computed: {
    elemType() {
      return this.$store.state.focus.elementType;
    },
    chartOptions() {
      // Compute XRANGE
      const XRANGE = 5 * 60000;

      return {
        chart: {
          id: "timeSeriesChart",
          zoom: {
            type: "x",
            enabled: false,
            autoScaleYaxis: true
          }
        },
        xaxis: {
          type: "datetime",
          range: XRANGE,
          title: {
            text: this.xlabel
          }
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              return val.toFixed(2);
            }
          },
          title: {
            text: this.ylabel
          }
        },
        stroke: {
          curve: "smooth"
        },
        title: {
          text: this.title
        },
        tooltip: {
          shared: false,
          y: {
            formatter: function(val) {
              return val.toFixed(2);
            }
          }
        }
      };
    }
  },
  mounted() {
    this.$root.$on("appendData", dataPoint => {
      this.$refs.chart.appendData([{ data: [dataPoint] }]);
    });
  }
};
</script>

<style scoped></style>
