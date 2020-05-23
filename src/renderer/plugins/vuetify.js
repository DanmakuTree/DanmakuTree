// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

console.log(1)
Vue.use(Vuetify)

const opts = {}

export default new Vuetify(opts)
