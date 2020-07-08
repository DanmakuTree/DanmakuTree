import Vue from 'vue/dist/vue.esm'
import ExternalWindow from './external'
import store from './store/index'
// import { Table, Input, Tag, Select, Popover, Switch, Spin, Icon, Avatar, Progress, message, Button } from 'ant-design-vue'
import Antd, { message } from 'ant-design-vue'
import VueVirtualScroller from 'vue-virtual-scroller'
import echarts from 'echarts'
import API from './plugins/API'
import 'ant-design-vue/dist/antd.css'
import './assets/style/iconfont/iconfont.css'
import './assets/style/global.css'

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import DanmakuMixin from './mixins/DanmakuMixin'

Vue.use(VueVirtualScroller)

const isDev = process.env.NODE_ENV === 'development'

Vue.config.devtools = isDev
Vue.config.performance = isDev
Vue.config.productionTip = isDev

Vue.prototype.$echarts = echarts

Vue.use(API)

Vue.use(Antd)
Vue.prototype.$message = message
var hash = new URLSearchParams((window.location.hash || '#').split('#', 2)[1])
Vue.prototype.$meta = {
  id: hash.get('module'),
  data: JSON.parse(hash.get('data'))
}
console.log(Vue.prototype.$meta)

Vue.mixin(DanmakuMixin)

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
