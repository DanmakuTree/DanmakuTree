import Vue from 'vue/dist/vue.esm'
import Web from './web'
import API from './plugins/API'
import DanmakuMixin from './mixins/DanmakuMixin'
import { WebsocketServiceClient } from './WebsocketServiceClient'

window.API = new WebsocketServiceClient('http://127.0.0.1', [6233, 6888, 60233, 60666, 60888])
Vue.use(API)

// var hash = new URLSearchParams((window.location.hash || '#').split('#', 2)[1])
// var loaddata = {}
// try {
//   const json = hash.get('data')
//   if (json !== 'undefined') {
//     loaddata = JSON.parse()
//   }
// } catch (error) {
//   console.log(error)
// }

// Vue.prototype.$meta = {
//   id: hash.get('module'),
//   data: loaddata
// }
// console.log(Vue.prototype.$meta)

Vue.mixin(DanmakuMixin)
export default new Vue({
  el: '#app',
  render: (h) => h(Web)
})
