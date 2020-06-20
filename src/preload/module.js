
var { ipcRenderer, remote, shell, clipboard } = require('electron').ipcRenderer
var currentWindows = remote.getCurrentWindow()

function APIStructure (itemName) {
  return new Proxy(function () {}, {
    get: (target, name) => {
      return APIStructure(itemName + '.' + name)
    },
    set: function (obj, prop, value) {
      throw new SyntaxError('You should not set anything.')
    },
    apply: function (target, thisArg, argumentsList) {
      return new Promise((resolve, reject) => {
        ipcRenderer.invoke('APICall', itemName, ...argumentsList).then((result) => {
          if (result.status === 0) {
            resolve(result.result)
          } else {
            reject(result)
          }
        }).catch((err) => { reject(err) })
      })
    }
  })
};
class CurrentWindows {
  close () {
    currentWindows.close()
  }

  minimize () {
    currentWindows.minimize()
  }

  maximize () {
    currentWindows.maximize()
  }

  moveTop () {
    currentWindows.moveTop()
  }

  setTitle (title) {
    currentWindows.setTitle(title)
  }

  setIgnoreMouseEvents (ignore, options = { forward: false }) {
    currentWindows.setIgnoreMouseEvents(ignore, options)
  }

  setBounds (bound) {
    currentWindows.setBounds(bound)
  }

  getBounds () {
    return currentWindows.getBounds()
  }
}

window.API = {
  Platform: APIStructure('Platform'),
  CurrentWindows: new CurrentWindows(),
  Module: APIStructure('Module'),
  Main: APIStructure('Main'),
  eventhandler (...args) { console.log(...args) },
  utils: {
    clipboard,
    openExternal (url) {
      return shell.openExternal(url)
    }
  }
}
ipcRenderer.on('event', (sender, e) => {
  try {
    window.API.eventhandler(e.name, ...e.data)
  } catch (error) {
    console.log(error)
  }
})
window.preloaddata = document.location.hash
