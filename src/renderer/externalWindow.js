import Vue from 'vue/dist/vue.esm'
import ExternalWindow from './external'
import store from './store/index'
import { Table, Input, Tag, Select, Popover, Switch } from 'ant-design-vue'

import VueVirtualScroller from 'vue-virtual-scroller'
import echarts from 'echarts'
import API from './plugins/API'
import 'ant-design-vue/dist/antd.css'
import './assets/style/iconfont/iconfont.css'
import './assets/style/global.css'

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

Vue.use(VueVirtualScroller)

const isDev = process.env.NODE_ENV === 'development'

Vue.config.devtools = isDev
Vue.config.performance = isDev
Vue.config.productionTip = isDev

Vue.prototype.$echarts = echarts

Vue.use(API)
Vue.use(Table)
Vue.use(Input)
Vue.use(Tag)
Vue.use(Select)
Vue.use(Popover)
Vue.use(Switch)

// // to solve for unknown reason #app not found.
// var appElement = document.getElementById('app')
// if (!appElement) {
//   appElement = document.createElement('div')
//   appElement.id = 'app'
//   document.body.appendChild(appElement)
// }

export default new Vue({
  el: '#app',
  store,
  render: (h) => h(ExternalWindow)
})
