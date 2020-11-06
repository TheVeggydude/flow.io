<template>
  <div id="app">
    <div class="header">
      <img id="logo" src="./assets/logo.png" />
      flow.io
    </div>

    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
}

#logo {
  width: 50px;
  height: 50px;
}

.header {
  background-color: cadetblue;
  color: white;
  min-height: 50px;
  align-content: flex-start;
  margin-bottom: 20px;
  padding: 5px;
  font-size: xx-large;
}

body {
  background-color: #efefef;
}
</style>
