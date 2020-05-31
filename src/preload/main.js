(() => {
  var ipcRenderer = require('electron').ipcRenderer
  window.API = {
    Platform: APIStructure('Platform')
  }
  function APIStructure (itemName) {
    return new Proxy(function () {}, {
      get: (target, name) => {
        return APIStructure(itemName + '.' + name)
      },
      set: function (obj, prop, value) {
        throw new SyntaxError('You should not set anything.')
      },
      apply: function (target, thisArg, argumentsList) {
        console.log(itemName + ' apply ', thisArg, argumentsList, ipcRenderer)
        return ipcRenderer.invoke('APICall', itemName, ...argumentsList)
      }
    })
  };
})()
