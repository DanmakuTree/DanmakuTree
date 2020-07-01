import Vue from 'vue/dist/vue.esm'
import App from './App'
import router from './router/index'
import store from './store/index'
// import { Table, Input, Tag, Select, Popover, Switch, Spin, Icon, Avatar, Progress, message, Button } from 'ant-design-vue'
import Antd from 'ant-design-vue'
import { message } from 'ant-design-vue'
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

// Vue.use(Table)
// Vue.use(Input)
// Vue.use(Tag)
// Vue.use(Select)
// Vue.use(Popover)
// Vue.use(Switch)
// Vue.use(Spin)
// Vue.use(Icon)
// Vue.use(Avatar)
// Vue.use(Progress)
// Vue.use(Button)

Vue.use(Antd)
Vue.prototype.$message = message
console.log('initializing...')

async function init () {
  // 拉取module信息
  await window.API.Module.getAllModuleList()
  // 初始化用户信息
  const result = await window.API.Platform.BiliBili.API.getUserLiveInfo()
  console.log(result)
  if (result.code === 0) {
    result.data.isLogin = true
    store.commit('setUserInfo', result.data)
  }
}
init().then(() => {
  store.commit('init')
  store.commit('hiddenModal')
})
export default new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
