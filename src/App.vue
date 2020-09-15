<template>
  <div id="app">
    <Home />
  </div>
</template>

<script>
import Home from "./components/Home.vue";

export default {
  name: "App",
  components: {
    Home,
  },
};
</script>

<style>
body,
html {
  margin: 0;
  overscroll-behavior: none;
}

body::-webkit-scrollbar {
  width: 0px;
  background-color: transparent;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: white;
  background-color: black;
  width: 100vw;
  transition: 0.5s;
  /* margin-top: 60px; */
}
</style>
