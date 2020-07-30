import { WebInterfaceBase } from './WebInterfaceBase'
import Axios from 'axios'
import { version, Backend, MainPreloadScript, MainWindowPage, ModuleWindowPage, isDev, BiliBiliPreloadScript, ModulePreloadScript, DataPath } from './Consts'
import { BrowserWindow, app, protocol, dialog } from 'electron'
import { eventBus } from './EventBus'
import { getLogger } from 'log4js'
import { URLSearchParams } from 'url'
import Database from 'better-sqlite3'
import { KVTable } from './KVTable'

const internalModuleList = [
  '6d443ea8-54ba-4a27-be2e-c4ab474c3230', // 首页
  '327a2641-531c-4129-8a8f-0fd18bab8601', // 房间列表
  '01a28479-4901-4b50-ae4a-92452d4bfe4f', // 历史弹幕
  'b3a11260-c5e1-4edb-b7cc-23e8f6285f97', // 插件中心
  '9ead739b-a95d-4673-9e40-2f18f4ad895e' //  系统设置
]
const BrowserWindowOptions = ['width', 'height', 'x', 'y', 'resizable', 'movable', 'minimizable', 'maximizable', 'focusable', 'alwaysOnTop', 'fullscreenable', 'skipTaskbar', 'frame', 'modal', 'acceptFirstMouse', 'disableAutoHideCursor', 'autoHideMenuBar', 'enableLargerThanScreen', 'backgroundColor', 'hasShadow', 'opacity', 'darkTheme', 'transparent', 'type', 'thickFrame', 'vibrancy']

export class ModuleManager extends WebInterfaceBase {
  constructor () {
    super()
    this.logger = getLogger('ModuleManager')
    this.version = '0.0.1'
    this.axios = Axios.create({
      baseURL: Backend,
      headers: {
        'user-agent': `DanmakuTree v${version}`
      }
    })
    this.database = null
    /**
     * @type {{any:BrowserWindow[]}}
     */
    this.map = {}
    this.moduleWindows = {}
    this.quitSign = false
    this.installedModuleList = []
    this.available.push('getAllModuleList', 'getModuleConfig', 'getModuleInfo', 'createModuleExternalWindow',
      'getModuleWindows', 'closeModuleWindows', 'forcecloseModuleWindows', 'getInstalledModuleList', 'installModule',
      'uninstallModule', 'updateModuleConfig', 'clearModuleConfig', 'requestQuickLink', 'getQuickLinkList', 'updateQuickLinkList',
      'getInternalModuleList', 'updateModuleData', 'getModuleData', 'clearModuleData')
    var bindList = ['getAllModuleList', 'getModuleConfig', 'getModuleInfo', 'sendToMainWindow', 'webviewInspector',
      'createModuleExternalWindow', 'getModuleWindows', 'closeModuleWindows', 'forcecloseModuleWindows', 'onMainQuit',
      'getInstalledModuleList', 'installModule', 'uninstallModule', 'updateModuleConfig', 'clearModuleConfig',
      'requestQuickLink', 'getQuickLinkList', 'updateQuickLinkList', 'getInternalModuleList', 'updateModuleData',
      'getModuleData', 'clearModuleData']
    this.moduleList = []
    bindList.forEach((e) => {
      this[e] = this[e].bind(this)
    })
    app.on('ready', () => {
      this.createMainWindow()
      if (isDev) {
        this.installDevTools()
      }

      protocol.registerHttpProtocol('branch', (req, callback) => {
        // eslint-disable-next-line standard/no-callback-literal
        callback({
          mimeType: 'text/html',
          data: Buffer.from('<h5>Blocked</h5>')
        })
      })
    })
    app.on('activate', () => {
      if (this.mainWindow === null) {
        // createWindow()
      }
    })
    eventBus.on('Main.quit', this.onMainQuit)
    eventBus.registerPublicEvent('Module.installListUpdate')
    eventBus.registerPublicEvent('Module.gotRequestQuickLink')
  }

  init () {
    this.database = new Database(DataPath + '/config/ModuleConfig.db')
    this.config = new KVTable(this.database, 'config')
    this.moduleConfig = new KVTable(this.database, 'moduleConfig')
    this.moduleData = new KVTable(this.database, 'moduleData')
    this.installedModuleList = JSON.parse(this.config.get('installedModuleList') || '[]')
  }

  /**
   * 拉取已安装模块列表
   */
  getInstalledModuleList () {
    return this.installedModuleList
  }

  getInternalModuleList () {
    return internalModuleList
  }

  /**
   * 安装模块
   * @param {string} moduleId 模块id
   * @returns {string[]|false}
   */
  installModule (moduleId) {
    if (internalModuleList.indexOf(moduleId) !== -1) {
      throw new Error('InternalModule')
    }
    var index = this.moduleList.findIndex((item) => {
      return item.id === moduleId
    })
    if (index !== -1 && this.installedModuleList.indexOf(moduleId)) {
      this.installedModuleList.push(moduleId)
      this.config.set('installedModuleList', JSON.stringify(this.installedModuleList))
      if (this.moduleList[index].defaultConfig) {
        this.updateModuleConfig(moduleId, this.moduleList[index].defaultConfig)
      }
      eventBus.emit('Module.installListUpdate')
      return true
    } else {
      return false
    }
  }

  uninstallModule (moduleId) {
    if (internalModuleList.indexOf(moduleId) !== -1) {
      throw new Error('InternalModule')
    }
    var index = this.installedModuleList.indexOf(moduleId)
    if (index !== -1) {
      this.installedModuleList.splice(index, 1)
      this.config.set('installedModuleList', JSON.stringify(this.installedModuleList))
      this.clearModuleConfig(moduleId)
      this.clearModuleData(moduleId)
      eventBus.emit('Module.installListUpdate')
      return true
    }
    return false
  }

  async getAllModuleList () {
    if (isDev || this.moduleList === []) {
      var data = (await this.axios.get('module/list', {
        params: {
          version: version
        }
      })).data
      this.moduleList = data
    }
    return data
  }

  async updateModuleConfig (moduleId, config) {
    this.moduleConfig.set(moduleId, JSON.stringify(config))
    eventBus.emit('Module.configChange', {
      moduleId: moduleId,
      config: JSON.stringify(config)
    })
    return true
  }

  async getModuleConfig (moduleId) {
    var config = this.moduleConfig.get(moduleId)
    if (config) {
      return JSON.parse(config)
    } else {
      return {}
    }
  }

  async clearModuleConfig (moduleId) {
    eventBus.emit('Module.configChange', {
      moduleId: moduleId,
      config: JSON.stringify({})
    })
    return this.moduleConfig.delete(moduleId)
  }

  async updateModuleData (moduleId, data) {
    this.moduleData.set(moduleId, JSON.stringify(data))
    eventBus.emit('Module.configChange', {
      moduleId: moduleId,
      data: JSON.stringify(data)
    })
    return true
  }

  async getModuleData (moduleId) {
    var data = this.moduleData.get(moduleId)
    if (data) {
      return JSON.parse(data)
    } else {
      return {}
    }
  }

  async clearModuleData (moduleId) {
    eventBus.emit('Module.dataChange', {
      moduleId: moduleId,
      data: JSON.stringify({})
    })
    return this.moduleData.delete(moduleId)
  }

  async requestQuickLink (moduleId, link) {
    if (this.installedModuleList.indexOf(moduleId) === -1 || internalModuleList.indexOf(moduleId) !== -1) {
      return false
    }
    if (!verifyLink(link)) {
      return false
    }
    link.moduleId = moduleId
    this.sendToMainWindow({
      name: 'Module.gotRequestQuickLink',
      data: [link]
    })
    return true
  }

  async getQuickLinkList () {
    var list = this.config.get('quickLinkList')
    if (typeof list !== 'string') {
      list = []
    } else {
      list = JSON.parse(list)
    }
    return list
  }

  async updateQuickLinkList (linkList) {
    return this.config.set('quickLinkList', JSON.stringify(linkList))
  }

  async getModuleInfo (moduleId) {
    if (isDev) {
      await this.getAllModuleList()
    }
    return this.moduleList.find((module) => {
      return module.id === moduleId
    })
  }

  async createModuleExternalWindow (moduleId, data) {
    if (isDev) {
      await this.getAllModuleList()
    }
    const module = this.moduleList.find((e) => {
      return e.id === moduleId
    })
    if (module === undefined) {
      return {
        code: -3,
        msg: 'no module or module list not load'
      }
    }
    if (module.externalWindow) {
      var option = {
        width: 800,
        height: 600,
        frame: false,
        title: '弹幕树',
        webPreferences: {
          nodeIntegration: false,
          nodeIntegrationInWorker: false,
          preload: ModulePreloadScript,
          webSecurity: false,
          webviewTag: false
        }
      }
      if (isDev) {
        option.webPreferences.devTools = true
      }
      if (module.externalWindow) {
        if (module.externalWindowOption) {
          if (module.externalWindowOption.only && this.moduleWindows[moduleId] && this.moduleWindows[moduleId].length > 0) {
            return {
              'code': -2,
              'msg': 'already have one'
            }
          }
          BrowserWindowOptions.forEach((e) => {
            if (module.externalWindowOption[e] !== undefined) {
              option[e] = module.externalWindowOption[e]
            }
          })
        }
        var moduleWindow = new BrowserWindow(option)

        moduleWindow.loadURL(ModuleWindowPage + `#${(new URLSearchParams({ module: moduleId, data: JSON.stringify(data) })).toString()}`)
        if (isDev) {
          moduleWindow.webContents.openDevTools({
            mode: 'detach'
          })
        }
        this.map[moduleWindow.id] = moduleId
        if (this.moduleWindows[moduleId]) {
          this.moduleWindows[moduleId].push(moduleWindow)
        } else {
          this.moduleWindows[moduleId] = []
          this.moduleWindows[moduleId].push(moduleWindow)
        }
        var listener = InsertArgument(this.sendEventToWindow, moduleWindow)
        const windowId = moduleWindow.id
        eventBus.on('ALLPUBLIC', listener)
        eventBus.onRaw('Module.configChange', listener)
        eventBus.onRaw('Module.dataChange', listener)
        moduleWindow.on('closed', () => {
          eventBus.detach('ALLPUBLIC', listener)
          eventBus.detach('Module.configChange', listener)
          eventBus.detach('Module.dataChange', listener)
          this.map[windowId] = undefined
          this.moduleWindows[moduleId] = this.moduleWindows[moduleId].filter((e) => {
            return e !== moduleWindow
          })
        })
        return {
          'code': 0,
          'msg': 'success',
          'data': windowId
        }
      }
    } else {
      return {
        'code': -1,
        'msg': 'not support'
      }
    }
  }

  async createMainWindow () {
    this.mainWindow = new BrowserWindow({
      backgroundColor: '#fff',
      width: 960,
      height: 600,
      minWidth: 960,
      minHeight: 600,
      // useContentSize: true,
      webPreferences: {
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        webSecurity: false,
        webviewTag: true,
        preload: MainPreloadScript
      },
      fullscreenable: false,
      maximizable: false,
      resizable: false,
      frame: false,
      show: false
    })

    // load root file/url
    this.mainWindow.loadURL(MainWindowPage)
    if (!isDev) {
      global.__static = require('path')
        .join(__dirname, '/static')
        .replace(/\\/g, '\\\\')
    }
    this.map[this.mainWindow.id] = 'main'
    if (isDev) {
      this.mainWindow.webContents.openDevTools({
        mode: 'detach'
      })
      this.mainWindow.webContents.on('did-attach-webview', (e, webContents) => {
        webContents.openDevTools({
          mode: 'detach'
        })
      })
    }
    // Show when loaded
    this.mainWindow.on('ready-to-show', () => {
      this.logger.info('MainWindow Ready')
      this.mainWindow.show()
      this.mainWindow.focus()
    })

    this.mainWindow.webContents.on('will-attach-webview', this.webviewInspector)
    this.mainWindow.on('close', (e) => {
      if (!this.quitSign) {
        e.preventDefault()
        dialog.showMessageBox({
          type: 'warning',
          message: '真的要退出弹幕树吗？',
          buttons: ['是', '否'],
          defaultId: 0,
          cancelId: 1
        }).then((res) => {
          if (res.response === 0) {
            eventBus.emit('Main.quit')
          }
        })
      }
    })
    this.mainWindow.on('closed', () => {
      this.mainWindow = null
      eventBus.detach('ALLPUBLIC', this.sendToMainWindow)
      eventBus.detach('Module.configChange', this.sendToMainWindow)
      eventBus.detach('Module.dataChange', this.sendToMainWindow)
      this.closeAllWindowAndExit()
      this.logger.info('MainWindow closed')
    })
    eventBus.on('ALLPUBLIC', this.sendToMainWindow)
    eventBus.onRaw('Module.configChange', this.sendToMainWindow)
    eventBus.onRaw('Module.dataChange', this.sendToMainWindow)
  }

  async installDevTools () {
    try {
      this.logger.info('Installing Vue-Devtools')
      require('vue-devtools').install()
    } catch (err) {
      this.logger.error('Install Vue-Devtools fail,', err)
    }
  }

  async getModuleWindows (moduleId) {
    if (this.moduleWindows[moduleId]) {
      return {
        code: 0,
        data: this.moduleWindows[moduleId].map((e) => {
          return e.id
        })
      }
    }
    return {
      code: 0,
      data: []
    }
  }

  async closeModuleWindows (moduleId, id) {
    if (this.moduleWindows[moduleId]) {
      /**
       * @type {BrowserWindow}
       */
      var window = this.moduleWindows[moduleId].find((e) => {
        return e.id === id
      })
      if (window) {
        window.close()
        return true
      }
    }
    return false
  }

  async forcecloseModuleWindows (moduleId, id) {
    if (this.moduleWindows[moduleId]) {
      /**
       * @type {BrowserWindow}
       */
      var window = this.moduleWindows[moduleId].find((e) => {
        return e.id === id
      })
      if (window) {
        window.destroy()
        return true
      }
    }
    return false
  }

  getMainWindow () {
    return this.mainWindow
  }

  sendToMainWindow (e) {
    try {
      this.mainWindow.webContents.send('event', e)
    } catch (error) {
      this.logger.info(`send ${e.name} event fail`, error)
    }
  }

  sendEventToWindow (window, e) {
    try {
      window.webContents.send('event', e)
    } catch (error) {
      this.logger.info(`send ${e.name} event to ${window.id} fail`, error)
    }
  }

  /**
   *
   * @param {Event} event
   * @param {webPreferences} webPreferences
   * @param {Record<string,string>} params
   */
  webviewInspector (event, webPreferences, params) {
    // console.log(params)
    try {
      var url = new URL(params.src)
      if (url.origin.endsWith('.bilibili.com')) {
        webPreferences.preloadURL = 'file://' + BiliBiliPreloadScript
      } else if (url.protocol === 'http' && url.host === 'localhost:9080') {
        webPreferences.preloadURL = ModulePreloadScript
      }
    } catch (error) {

    }
  }

  onMainQuit () {
    this.quitSign = true
    this.mainWindow.close()
  }

  closeAllWindowAndExit () {
    var windowList = BrowserWindow.getAllWindows()
    windowList.forEach((e) => {
      e.close()
    })
    setTimeout(() => {
      app.exit()
    })
  }
}

function InsertArgument (target, ...data) {
  return new Proxy(target, {
    apply: (target, thisArg, argumentsList) => {
      return target(...data, ...argumentsList)
    }
  })
}

function verifyLink (link) {
  if (typeof link !== 'object') {
    return false
  }
  if (typeof link.name !== 'string' || link.name.length <= 0) {
    return false
  }
  if (typeof link.action !== 'string' || link.action.length <= 0) {
    return false
  }
  if (!(typeof link.icon === 'string' && link.icon.length > 0) && typeof link.icon !== 'undefined') {
    return false
  }
  return true
}
