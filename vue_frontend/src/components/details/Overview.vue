<template>
  <div class="panel">
    <div class="panel-heading">Details</div>

    <div v-if="id && id.toString() !== '' && series[0].data.length !== 0">
      <div class="panel-block" id="modelData">
        <specs></specs>
      </div>

      <div class="content" id="chartContent">
        <time-series-chart
          :title="title"
          xlabel="Time"
          :ylabel="ylabel"
          v-bind:series="series"
        ></time-series-chart>
      </div>
    </div>

    <div v-else>
      <div class="panel-block">
        <span class="is-warning">
          Select a pipeline element to get more information.</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import Specs from "@/components/details/Specs";
import TimeSeriesChart from "@/components/charts/TimeSeriesChart";
import axios from "axios";

export default {
  name: "Overview",
  components: {
    Specs,
    TimeSeriesChart
  },
  computed: {
    elemType() {
      return this.$store.state.focus.elementType;
    },

    title() {
      let title = "Check title!";
      switch (this.$store.state.focus.elementType) {
        case "port":
          title = "Real-time production";
          break;
        case "basin":
          title = "Real-time load";
          break;
      }

      return title;
    },

    ylabel() {
      let label = "Check title!";
      switch (this.$store.state.focus.elementType) {
        case "port":
          label = "Production";
          break;
        case "basin":
          label = "Load";
          break;
      }

      return label;
    },

    series() {
      // Only get the last bit of data. Only this is relevant.
      const RELRANGE = (60 / 3) * 6;
      const histData = this.$store.state.focus.history;
      const relevantData = histData.slice(
        Math.max(histData.length - RELRANGE, 0)
      );

      return [
        {
          data: relevantData
        }
      ];
    }
  },

  asyncComputed: {
    async id() {
      if (this.$store.state.focus.elementId === "") {
        return "";
      }

      // ID has changed, therefore we need to update the history too.
      let reply = {
        data: []
      };

      // Keep fetching data until reply given
      while (reply.data.length === 0) {
        reply = await axios.get("http://localhost:4003/historical/all", {
          params: {
            id: this.$store.state.focus.elementId,
            type: this.elemType
          }
        });
      }

      // map the data to proper format
      const historicalData = reply.data.map(elem => {
        const timestamp = new Date(elem.ts);

        // Select proper value
        let value = null;
        switch (this.elemType) {
          case "port":
            value = elem.production;
            break;
          case "basin":
            value = elem.load;
            break;
        }

        return {
          x: timestamp,
          y: value
        };
      });

      this.$store.commit("setHistory", historicalData);

      return this.$store.state.focus.elementId;
    }
  }
};
</script>

<style scoped>
.panel {
  background-color: white;
}

.panel-heading {
  background-color: cadetblue;
  color: white;
}

#modelData {
  text-align: left;
}

#chartContent {
  padding: 10px;
}
</style>
