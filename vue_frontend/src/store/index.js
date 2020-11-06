import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// Define Vuex ports model
const portsModule = {
  state: () => ({
    latest: [],
    loading: true
  }),
  mutations: {
    // Sets the latest value into the data store
    setLatestPorts(state, list) {
      state.latest = list;
    },
    updateLatestPorts(state, message) {
      const foundPort = state.latest.findIndex(x => x.id === message.id);
      Vue.set(state.latest, foundPort, message);
    },
    updateLoadingPorts(state, flag) {
      state.loading = flag;
    }
  }
};

// Define Vuex basins model
const basinsModule = {
  state: () => ({
    latest: [],
    loading: true
  }),
  mutations: {
    // Sets a list of values into the data store
    setLatestBasins(state, list) {
      state.latest = list;
    },
    updateLatestBasins(state, message) {
      const foundBasin = state.latest.findIndex(x => x.id === message.id);
      Vue.set(state.latest, foundBasin, message);
    },
    updateLoadingBasins(state, flag) {
      state.loading = flag;
    }
  }
};

// Define Vuex details model
const historyModule = {
  state: () => ({
    elementId: "",
    elementType: "",
    history: []
  }),
  mutations: {
    // Sets the id to be tracked
    setId(state, id) {
      state.elementId = id;
    },
    // Sets the type to be tracked
    setType(state, newType) {
      state.elementType = newType;
    },
    // Sets the initial historical data array
    setHistory(state, history) {
      state.history = history;
    },
    // Appends a single update to the history list
    appendHistory(state, newElem) {
      state.history.push(newElem);
    }
  }
};

// Create Vuex store using models
const store = new Vuex.Store({
  modules: {
    ports: portsModule,
    basins: basinsModule,
    focus: historyModule
  }
});

export default store;
