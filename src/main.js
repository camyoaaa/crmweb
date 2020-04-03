// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
// import "./permission"; // permission control 权限控制
import './RouterControl';
import store from "@/store/";
import Antv from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
// import "./global.less";
import './momentplugin.js';
import './kaxios.js'
import VueStorage from "vue-ls";

import '@/commonItems'

Vue.config.productionTip = false;

Vue.use(Antv);

Vue

Vue.use(VueStorage, {
  namespace: "pro__", // key prefix
  name: "ls", // name variable Vue.[ls] or this.[$ls],
  storage: "local" // storage name session, local, memory
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: {
    App
  },
  template: "<App/>"
});
