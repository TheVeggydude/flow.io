<template>
  <div class="panel">
    <div class="panel-heading">
      Pipeline overview
    </div>

    <b-tabs position="is-centered" class="block" v-model="activeTab">
      <b-tab-item label="Ports">
        <latest-elements elementType="port"></latest-elements>
      </b-tab-item>

      <b-tab-item label="Basins">
        <latest-elements elementType="basin"></latest-elements>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import LatestElements from "@/components/tables/LatestElements";

export default {
  name: "ElementList",

  components: {
    LatestElements
  },

  data() {
    return {
      activeTab: 0,
      showBooks: false
    };
  }
};
</script>

<style scoped>
.panel-heading {
  background-color: cadetblue;
  color: white;
}

.panel {
  background-color: white;
}
</style>
