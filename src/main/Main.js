import { WebInterfaceBase } from './WebInterfaceBase'
import Services from './Services'
import { version, DataPath, gitVersion, isDev } from './Consts'
import { dialog } from 'electron'
import { eventBus } from './EventBus'
import Database from 'better-sqlite3'
import { KVTable } from './KVTable'

export class Main extends WebInterfaceBase {
  constructor () {
    super()
    var methodList = ['init', 'getConfig', 'updateConfig', 'quit', 'getVersion', 'getRoomList', 'updateRoomList', 'getGitVersion', 'isDev']
    methodList.forEach((e) => { this[e] = this[e].bind(this) })
    this.available.push('Services', 'getConfig', 'updateConfig', 'getVersion', 'getRoomList', 'updateRoomList', 'getGitVersion', 'isDev')
    this.Services = Services
    this.database = null
    this.roomList = null
    eventBus.registerPublicEvent('Main.quit')
    eventBus.registerPublicEvent('Main.roomListUpdate')
    eventBus.registerPublicEvent('Main.mainRoomUpdate')
  }

  init () {
    this.database = new Database(DataPath + '/config/config.db')
    this.Services.init()
    this.config = new KVTable(this.database, 'config')
  }

  async getConfig (key) {
    if (key === 'roomList') {
      return []
    }
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

  async getRoomList () {
    if (this.roomList === null) {
      var list = this.config.get('roomList')
      if (!list) {
        this.roomList = []
      } else {
        try {
          this.roomList = JSON.parse(list)
        } catch (error) {
          this.roomList = []
        }
      }
    }
    return this.roomList
  }

  async updateRoomList (list) {
    await this.getRoomList()
    if (typeof list === 'object' && Array.isArray(list) && list.every(verifyRoom)) {
      var map = {}
      list.forEach((room) => {
        if (!map[room.platform]) {
          map[room.platform] = {}
        }
        if (map[room.platform][room.roomId]) {
          throw new Error('Have Same Room')
        }
        map[room.platform][room.roomId] = true
      })
      this.config.set('roomList', JSON.stringify(list))
      var oldList = this.roomList
      this.roomList = list
      if (oldList[0]) {
        if (list[0]) {
          if (list[0].platform !== oldList[0].platform ||
             list[0].roomId !== oldList[0].roomId) {
            eventBus.emit('Main.mainRoomUpdate', { old: oldList[0], new: list[0] })
          }
        } else {
          eventBus.emit('Main.mainRoomUpdate', { old: oldList[0], new: undefined })
        }
      } else if (list[0]) {
        eventBus.emit('Main.mainRoomUpdate', { old: undefined, new: list[0] })
      }
      eventBus.registerPublicEvent('Main.roomListUpdate')
    } else {
      throw new Error('Bad Type')
    }
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

  async getGitVersion () {
    return gitVersion
  }

  async isDev () {
    return isDev
  }
}

function verifyRoom (room) {
  return typeof room === 'object' &&
  (typeof room.roomId === 'string' || typeof room.roomId === 'number') &&
  (typeof room.platform === 'string')
}
