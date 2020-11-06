import Vue from "vue";
import App from "./App.vue";
Vue.config.productionTip = false;

import router from "./router";

import Buefy from "buefy";
import "buefy/dist/buefy.css";
Vue.use(Buefy);

import AsyncComputed from "vue-async-computed";
Vue.use(AsyncComputed);

import VueApexCharts from "vue-apexcharts";
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);

import store from "./store/index";

// Setup websocket
const ws = new WebSocket("ws://localhost:4002");

ws.onmessage = message => {
  handleMessage(message.data);
};

ws.onerror = error => {
  console.log(`WS error: ` + error);
};

function handleMessage(message) {
  message = JSON.parse(message);

  // Commit message to latest updates
  let value = null;
  switch (message.type) {
    case "port":
      value = message.production;
      store.commit("updateLatestPorts", message);
      break;
    case "basin":
      value = message.load;
      store.commit("updateLatestBasins", message);
      break;
    default:
      console.log("Incorrect msg received, ignoring");
  }

  // Give data to chart
  if (value !== null && store.state.focus.elementId === message.id) {
    const dataPoint = {
      x: message.ts,
      y: value
    };

    vm.$root.$emit("appendData", dataPoint);
  }
}

var vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
