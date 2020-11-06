<template>
  <b-table
    :hoverable="true"
    :loading="loading"
    :data="data"
    selectable
    @select="selectedRow"
  >
    <b-table-column field="id" label="ID" numeric v-slot="props">
      {{ props.row.id }}
    </b-table-column>

    <!--  Alter the shown metric based on element type  -->
    <template v-if="this.elementType === 'basin'">
      <b-table-column field="load" label="Load" numeric v-slot="props">
        {{ props.row.load.toFixed(2) }}
      </b-table-column>
    </template>
    <template v-else-if="this.elementType === 'port'">
      <b-table-column field="load" label="Production" numeric v-slot="props">
        {{ props.row.production.toFixed(2) }}
      </b-table-column>
    </template>

    <b-table-column field="timestamp" label="Timestamp" numeric v-slot="props">
      {{ formatDate(props.row.ts) }}
    </b-table-column>
  </b-table>
</template>

<script>
import axios from "axios";
import DateMixins from "@/services/DateMixins";

export default {
  name: "LatestElements",
  mixins: [DateMixins],

  props: ["elementType"],

  computed: {
    data() {
      let data = "";
      switch (this.elementType) {
        case "port":
          data = this.$store.state.ports.latest;
          break;
        case "basin":
          data = this.$store.state.basins.latest;
          break;
      }

      return data;
    },
    loading() {
      let loading = "";
      switch (this.elementType) {
        case "port":
          loading = this.$store.state.ports.loading;
          break;
        case "basin":
          loading = this.$store.state.basins.loading;
          break;
      }

      return loading;
    }
  },

  methods: {
    selectedRow(item) {
      this.$store.commit("setType", this.elementType);
      this.$store.commit("setId", item.id);
    }
  },

  mounted() {

    // Collect element data
    axios
      .get(`http://localhost:4003/historical/latest`, {
        params: {
          type: this.elementType
        }
      })
      .then(response => {
        // JSON responses are automatically parsed.

        // Commit to different stores depending on element type.
        switch (this.elementType) {
          case "port":
            this.$store.commit("setLatestPorts", response.data);
            this.$store.commit("updateLoadingPorts", false);
            break;
          case "basin":
            this.$store.commit("setLatestBasins", response.data);
            this.$store.commit("updateLoadingBasins", false);
            break;
        }
      })
      .catch(e => {
        this.errors.push(e);
      });
  }
};
</script>

<style scoped></style>
