import 'material-design-icons/iconfont/material-icons.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

const isDev = process.env.NODE_ENV === 'development'

Vue.config.devtools = isDev
Vue.config.performance = isDev
Vue.config.productionTip = isDev

// tslint:disable-next-line: no-unused-expression
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})

// sample context menu
// const { remote } = require('electron')
// const { Menu, MenuItem } = remote
// const menu = new Menu()
// menu.append(new MenuItem({ label: 'Home' }))
// menu.append(new MenuItem({ type: 'separator' }))
// menu.append(new MenuItem({ label: 'Other' }))

// window.addEventListener(
//   'contextmenu',
//   (e) => {
//     e.preventDefault()
//     menu.popup({ window: remote.getCurrentWindow() })
//   },
//   false
// )
