import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import asyncRoute from './modules/asyncRoute'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    asyncRoute
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
