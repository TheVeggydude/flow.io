<template>
  <div class="container is-widescreen">
    <div class="columns">
      <div class="column is-two-fifths">
        <element-list></element-list>
      </div>

      <div class="column">
        <overview></overview>
      </div>
    </div>
  </div>
</template>

<script>
import ElementList from "@/components/ElementList";
import Overview from "@/components/details/Overview";

export default {
  name: "Home",
  components: {
    Overview,
    ElementList
  }
};
</script>

<style scoped></style>
