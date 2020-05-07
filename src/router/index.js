import Vue from "vue";
import Router from "vue-router";

import constantRoutes from './constantRoutes.js'

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [...constantRoutes]
});
