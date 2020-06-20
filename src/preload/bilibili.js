var ipcRenderer = require('electron').ipcRenderer
window.biliInject = {
  postMessage: (...args) => {
    ipcRenderer.send('captcha', 'postMessage', ...args)
  },
  error: (...args) => {
    ipcRenderer.send('captcha', 'error', ...args)
  },
  success: (...args) => {
    ipcRenderer.send('captcha', 'success', ...args)
  },
  isSupportJSInjected: (...args) => {
    ipcRenderer.send('captcha', 'erroisSupportJSInjectedr', ...args)
  }
}
ipcRenderer.on('captchaCallback', (e, ...args) => {
  if (window.biliInject.biliCallbackReceived) {
    window.biliInject.biliCallbackReceived(...args)
  }
})
