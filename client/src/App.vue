<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>

<script>
import jwt_decode from "jwt-decode";
export default {
  name: "login",
  component: {},
  created() {
    if (localStorage.eleToken) {
      const decode = jwt_decode(localStorage.eleToken);
      this.$store.dispatch("setAuthenticated", !!decode);
      this.$store.dispatch("setUser", decode);
    }
  },
  methods: {}aaa
};
</script>
