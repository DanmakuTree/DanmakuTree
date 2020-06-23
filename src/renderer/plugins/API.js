import EventEmmitter from 'events'
export default {
  install (Vue) {
    Vue.prototype.$platform = window.API.Platform
    Vue.prototype.$currentWindow = window.API.CurrentWindow
    Vue.prototype.$module = window.API.Module
    Vue.prototype.$main = window.API.Main
    window.API.event = new EventEmmitter()
    window.API.eventhandler = (...args) => {
      window.API.event.emit(...args)
    }
  }
}
