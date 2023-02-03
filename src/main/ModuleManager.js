import { WebInterfaceBase } from './WebInterfaceBase'
import Axios from 'axios'
import { Agent } from 'https'
import { version, Backend, MainPreloadScript, MainWindowPage, ModuleWindowPage, isDev, BiliBiliPreloadScript, ModulePreloadScript, DataPath } from './Consts'
import { BrowserWindow, app, protocol, dialog } from 'electron'
import { eventBus } from './EventBus'
import { getLogger } from 'log4js'
import { URLSearchParams } from 'url'
import Database from 'better-sqlite3'
import { KVTable } from './KVTable'
import { createTrayIcon } from './TrayIcon'

const internalModuleList = [
  '6d443ea8-54ba-4a27-be2e-c4ab474c3230', // 首页
  '327a2641-531c-4129-8a8f-0fd18bab8601', // 房间列表
  '01a28479-4901-4b50-ae4a-92452d4bfe4f', // 历史弹幕
  'b3a11260-c5e1-4edb-b7cc-23e8f6285f97', // 插件中心
  '9ead739b-a95d-4673-9e40-2f18f4ad895e' //  系统设置
]
const BrowserWindowOptions = ['width', 'height', 'x', 'y', 'resizable', 'movable', 'minimizable', 'maximizable', 'focusable', 'alwaysOnTop', 'fullscreenable', 'skipTaskbar', 'frame', 'modal', 'acceptFirstMouse', 'disableAutoHideCursor', 'autoHideMenuBar', 'enableLargerThanScreen', 'backgroundColor', 'hasShadow', 'opacity', 'darkTheme', 'transparent', 'type', 'thickFrame', 'vibrancy']

const ISRGCAs = [`-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4
WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu
ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY
MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc
h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+
0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U
A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW
T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH
B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC
B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv
KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn
OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn
jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw
qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI
rU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV
HRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq
hkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL
ubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ
3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRcOj/KK
NFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5
ORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur
TkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC
jNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc
oyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq
4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA
mRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d
emyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=
-----END CERTIFICATE-----`]
const agent = new Agent({ ca: ISRGCAs })

export class ModuleManager extends WebInterfaceBase {
  constructor () {
    super()
    this.logger = getLogger('ModuleManager')
    this.version = '0.0.1'
    this.axios = Axios.create({
      httpsAgent: agent,
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
    this.tray = null
    this.quitSign = false
    this.installedModuleList = []
    this.available.push('getAllModuleList', 'getModuleConfig', 'getModuleInfo', 'createModuleExternalWindow',
      'getModuleWindows', 'closeModuleWindows', 'toggleModuleWindowVisibility', 'getModuleWindowVisibility', 'forcecloseModuleWindows', 'getInstalledModuleList', 'installModule',
      'uninstallModule', 'updateModuleConfig', 'clearModuleConfig', 'requestQuickLink', 'getQuickLinkList', 'updateQuickLinkList',
      'getInternalModuleList', 'updateModuleData', 'getModuleData', 'clearModuleData')
    var bindList = ['getAllModuleList', 'getModuleConfig', 'getModuleInfo', 'sendToMainWindow', 'webviewInspector',
      'createModuleExternalWindow', 'getModuleWindows', 'closeModuleWindows', 'toggleModuleWindowVisibility', 'getModuleWindowVisibility', 'forcecloseModuleWindows', 'onMainQuit',
      'getInstalledModuleList', 'installModule', 'uninstallModule', 'updateModuleConfig', 'clearModuleConfig',
      'requestQuickLink', 'getQuickLinkList', 'updateQuickLinkList', 'getInternalModuleList', 'updateModuleData',
      'getModuleData', 'clearModuleData', 'getMainWindow']
    this.moduleList = []
    bindList.forEach((e) => {
      this[e] = this[e].bind(this)
    })
    app.on('ready', async () => {
      await this.createMainWindow()
      if (isDev) {
        this.installDevTools()
      }
      this.tray = createTrayIcon(this.getMainWindow)
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

  async getAllModuleList (update = false) {
    if (isDev || this.moduleList.length === 0 || update) {
      var data = (await this.axios.get('module/list', {
        params: {
          version: version
        }
      })).data
      this.moduleList = data
    }
    return this.moduleList
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

  async toggleModuleWindowVisibility (moduleId, id) {
    if (this.moduleWindows[moduleId]) {
      /**
       * @type {BrowserWindow}
       */
      var window = this.moduleWindows[moduleId].find((e) => {
        return e.id === id
      })
      if (window) {
        if (window.isVisible()) {
          window.hide()
        } else {
          window.show()
        }
        return true
      }
    }
    return false
  }

  async getModuleWindowVisibility (moduleId, id) {
    if (this.moduleWindows[moduleId]) {
      /**
       * @type {BrowserWindow}
       */
      var window = this.moduleWindows[moduleId].find((e) => {
        return e.id === id
      })
      if (window) {
        return { isVisible: window.isVisible() }
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
