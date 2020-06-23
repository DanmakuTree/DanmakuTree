export default {
  mounted () {
    const danmaku = this.$options.danmaku
    if (danmaku) {
      this._danmakuEventListener = {}
      Object.keys(danmaku).forEach(event => {
        const func = danmaku[event].bind(this)
        window.API.event.on(event, func)
        this._danmakuEventListener[event] = func
      })
    }
  },
  beforeDestroy () {
    if (this._danmakuEventListener) {
      Object.keys(this._danmakuEventListener).forEach(event => {
        window.API.event.removeListener(event, this._danmakuEventListener[event])
      })
    }
  }
}
