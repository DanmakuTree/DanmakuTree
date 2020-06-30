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
window.postMessage = (data) => {
  ipcRenderer.sendToHost('message', data)
}
window.parent.postMessage = (data) => {
  ipcRenderer.sendToHost('message', data)
}
if (window.location.href.startsWith('https://passport.bilibili.com/ajax/miniLogin/minilogin')) {
  window.onload = function () {
    document.querySelector('#wrapper').onclick = function (e) { if (e.toElement.id === 'wrapper') { document.querySelector('#close').click() } }
    var content = document.querySelector('#content')
    function toggle (num) {
      switch (num) {
        case 1:
          content.setAttribute('style', 'top:45%;')
          break
        case 2:
          content.setAttribute('style', 'top:48%;')
          break
        default:
          content.setAttribute('style', 'top:50%;')
          break
      }
    }
    document.querySelector('#to-qrcode').onclick = function () { toggle(1) }
    document.querySelector('#tab-nav > div:nth-child(2)').onclick = function () { toggle(2) }
    document.querySelector('#tab-nav > div:nth-child(1)').onclick = function () {
      var d = document.querySelector('#login-normal').style.display
      if (d === 'block' || d === '') toggle(false)
      else if (document.querySelector('#login-normal').style.display === 'none') toggle(1)
    }
    document.querySelector('#from-qrcode').onclick = function () { toggle(false) }
  }
}
