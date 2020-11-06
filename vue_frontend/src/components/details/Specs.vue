<template>
  <div class="content" v-if="this.model !== null">
    <ul>
      <li>ID: {{ model.name }}</li>
      <li>Model: {{ model.model }}</li>
      <li>Location: {{ model.location }}</li>
      <li>Installation date: {{ formatDate(model.installed) }}</li>
      <li>Last checkup : {{ formatDate(model.lastCheckup) }}</li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import DateMixins from "@/services/DateMixins";

export default {
  name: "Specs",
  mixins: [DateMixins],

  asyncComputed: {
    async model() {
      if (this.$store.state.focus.elementId === "") {
        return [];
      }

      let reply = {
        data: []
      };

      // Keep fetching data until reply given
      while (reply.data.length === 0) {
        reply = await axios.get("http://localhost:4003/model/element", {
          params: {
            name: this.$store.state.focus.elementId
          }
        });
      }

      return reply.data[0];
    }
  }
};
</script>

<style scoped></style>
