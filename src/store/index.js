import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import appconfig from './modules/appconfig'
import socketUuid from './modules/socketUuid'
import notify from './modules/notify'
import permission from './modules/permission'



import asyncRoute from './modules/asyncRoute'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    appconfig,
    asyncRoute,
    socketUuid,
    notify,
    permission
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
