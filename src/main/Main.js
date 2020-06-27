import { WebInterfaceBase } from './WebInterfaceBase'
import Services from './Services'
import { version, DataPath } from './Consts'
import { dialog } from 'electron'
import { eventBus } from './EventBus'
import Database from 'better-sqlite3'
import { KVTable } from './KVTable'

export class Main extends WebInterfaceBase {
  constructor () {
    super()
    var methodList = ['init', 'getConfig', 'updateConfig', 'quit', 'getVersion']
    methodList.forEach((e) => { this[e] = this[e].bind(this) })
    this.available.push('Services', 'getConfig', 'updateConfig', 'getVersion')
    this.Services = Services
    this.database = null
    eventBus.registerPublicEvent('Main.quit')
  }

  init () {
    this.database = new Database(DataPath + '/config/config.db')
    this.Services.init()
    this.config = new KVTable(this.database, 'config')
  }

  async getConfig (key) {
    return (() => {
      try {
        return JSON.parse(this.config.get(key))
      } catch (error) {
        return undefined
      }
    })()
  }

  async updateConfig (key, value) {
    return this.config.set(key, JSON.stringify(value))
  }

  async quit () {
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

  async getVersion () {
    return version
  }
}
