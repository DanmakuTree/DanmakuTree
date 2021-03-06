var { ipcRenderer, remote, shell, clipboard } = require('electron')
var currentWindow = remote.getCurrentWindow()

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
class CurrentWindow {
  constructor () {
    currentWindow.on('move', () => {
      try {
        window.API.eventhandler('CurrentWindow.move', {})
      } catch (error) {
        console.log(error)
      }
    })
    currentWindow.on('resize', () => {
      try {
        window.API.eventhandler('CurrentWindow.resize', {})
      } catch (error) {
        console.log(error)
      }
    })
  }

  close () {
    currentWindow.close()
  }

  minimize () {
    currentWindow.minimize()
  }

  maximize () {
    currentWindow.maximize()
  }

  moveTop () {
    currentWindow.moveTop()
  }

  setTitle (title) {
    currentWindow.setTitle(title)
  }

  setIgnoreMouseEvents (ignore, options = { forward: false }) {
    currentWindow.setIgnoreMouseEvents(ignore, options)
  }

  setBounds (bound) {
    currentWindow.setBounds(bound)
  }

  getBounds () {
    return currentWindow.getBounds()
  }

  setAlwaysonTop (flag) {
    return currentWindow.setAlwaysOnTop(flag, 'screen-saver')
  }
}

window.API = {
  Platform: APIStructure('Platform'),
  CurrentWindow: new CurrentWindow(),
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
