import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

import modules from './modules'

Vue.use(Vuex)

console.info(modules)
export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'

  // TODO: Enable when deploy
  // plugins: [createPersistedState()]
})
