import { WebInterfaceBase } from '../../../../WebInterfaceBase'
import { eventBus } from '../../../../EventBus'
import { Room } from './Room'
import Database from 'better-sqlite3'
import { DataPath } from '../../../../Consts'
import { KVTable } from '../../../../KVTable'
import { isInteger } from 'lodash'
import { RoomLiveTable } from './RoomLiveTable'
import { StatisticsTable } from './StatisticsTable'

export class StatisticsService extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.8.7'
    this.store = null
    this.roomMap = {}
    var methodList = ['init', 'onMessage', 'onConnect', 'onClose']
    methodList.forEach((e) => {
      this[e] = this[e].bind(this)
    })
    var publicList = ['getRoomList', 'getRoomLiveList', 'getRoomLiveStatAll', 'getRoomLiveStatLast']
    publicList.forEach((e) => {
      this.available.push(e)
      this[e] = this[e].bind(this)
    })
    eventBus.on('Platform.BiliBili.Service.DanmakuService.control.authSuccess', this.onConnect)
    eventBus.on('Platform.BiliBili.Service.DanmakuService.control.close', this.onClose)
    eventBus.on('Platform.BiliBili.Service.DanmakuService.Message', this.onMessage)
  }

  init () {
    this.store = new Database(DataPath + '/data/BiliBiliStatistics.db')
    this.roomList = new KVTable(this.store, 'roomList')
  }

  getRoomList () {
    return this.roomList.keys()
  }

  getRoomLiveList (roomId) {
    if (isInteger(roomId) && roomId > 0) {
      if (this.store.prepare('SELECT count(*) FROM sqlite_master WHERE name = ?').get(`Room-${roomId}`)['count(*)'] > 0) {
        return (new RoomLiveTable(this.store, `Room-${roomId}`)).getAll()
      }
    }
    return []
  }

  getRoomLiveListLast (roomId, num) {
    if (isInteger(roomId) && roomId > 0) {
      if (this.store.prepare('SELECT count(*) FROM sqlite_master WHERE name = ?').get(`Room-${roomId}`)['count(*)'] > 0) {
        return (new RoomLiveTable(this.store, `Room-${roomId}`)).getLast(num)
      }
    }
    return []
  }

  getRoomLiveStatAll (LiveId) {
    if (typeof LiveId === 'string') {
      if (this.store.prepare('SELECT count(*) FROM sqlite_master WHERE name = ?').get(`Live-${LiveId}`)['count(*)'] > 0) {
        return (new StatisticsTable(this.store, `Live-${LiveId}`)).getAll()
      }
    }
    return []
  }

  getRoomLiveStatLast (LiveId, num = 30) {
    if (typeof LiveId === 'string') {
      if (this.store.prepare('SELECT count(*) FROM sqlite_master WHERE name = ?').get(`Live-${LiveId}`)['count(*)'] > 0) {
        return (new StatisticsTable(this.store, `Live-${LiveId}`)).getLast(num)
      }
    }
    return []
  }

  onMessage (message) {
    if (this.roomMap[message.roomId]) {
      this.roomMap[message.roomId].action(message.data)
    }
  }

  onConnect (roomId) {
    if (!this.roomMap[roomId]) {
      this.roomMap[roomId] = new Room(roomId, this.store)
      this.roomList.set(roomId, 'true')
    }
    this.roomMap[roomId].onConnect()
  }

  onClose (roomId) {
    if (this.roomMap[roomId]) {
      this.roomMap[roomId].onClose()
    }
  }
}

export default new StatisticsService()
