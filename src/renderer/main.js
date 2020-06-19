import Vue from 'vue/dist/vue.esm'
import App from './App'
import router from './router/index'
import store from './store/index'
import Antd from 'ant-design-vue'
import VueVirtualScroller from 'vue-virtual-scroller'
import echarts from 'echarts'
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

Vue.use(Antd)

export default new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
