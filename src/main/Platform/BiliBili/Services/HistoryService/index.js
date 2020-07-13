import { WebInterfaceBase } from '../../../../WebInterfaceBase'
import { eventBus } from '../../../../EventBus'
import Database from 'better-sqlite3'
import { DataPath } from '../../../../Consts'
import { KVTable } from '../../../../KVTable'
import { isInteger } from 'lodash'
import { HistoryTable } from './HistoryTable'
import { Query } from './Query'

export class HistoryService extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.0.1'
    this.store = null
    this.roomMap = {}
    var methodList = ['init', 'onMessage', 'onConnect', 'onClose']
    methodList.forEach((e) => {
      this[e] = this[e].bind(this)
    })
    var publicList = ['getRoomList', 'getRoomHistoryLatest', 'getRoomHistoryAll', 'getRoomHistoryByPageBeforeLongtimestamp', 'room']
    publicList.forEach((e) => {
      this.available.push(e)
      this[e] = this[e].bind(this)
    })
    eventBus.on('Platform.BiliBili.Service.DanmakuService.control.authSuccess', this.onConnect)
    eventBus.on('Platform.BiliBili.Service.DanmakuService.control.close', this.onClose)
    eventBus.on('Platform.BiliBili.Service.DanmakuService.Message', this.onMessage)
  }

  init () {
    this.store = new Database(DataPath + '/data/BiliBiliDanmakuHistory.db')
    this.roomList = new KVTable(this.store, 'roomList')
  }

  getRoomList () {
    return this.roomList.keys()
  }

  getRoomHistoryLatest (roomId, num) {
    if (isInteger(roomId) && roomId > 0 && num > 0) {
      if (this.store.prepare('SELECT count(*) FROM sqlite_master WHERE name = ?').get(`Room-${roomId}`)['count(*)'] > 0) {
        var room = this.roomMap[roomId]
        if (!room) { return (new HistoryTable(this.store, `Room-${roomId}`)).getLatest(num) } else { return room.getLatest(num) }
      }
    }
    return []
  }

  getRoomHistoryAll (roomId) {
    if (isInteger(roomId) && roomId > 0) {
      if (this.store.prepare('SELECT count(*) FROM sqlite_master WHERE name = ?').get(`Room-${roomId}`)['count(*)'] > 0) {
        var room = this.roomMap[roomId]
        if (!room) { return (new HistoryTable(this.store, `Room-${roomId}`)).getAll() } else { return room.getAll() }
      }
    }
    return []
  }

  getRoomHistoryByPageBeforeLongtimestamp (roomId, pageSize = undefined, longtimestamp = undefined) {
    if (isInteger(roomId) && roomId > 0) {
      if (this.store.prepare('SELECT count(*) FROM sqlite_master WHERE name = ?').get(`Room-${roomId}`)['count(*)'] > 0) {
        var room = this.roomMap[roomId]
        if (!room) { return (new HistoryTable(this.store, `Room-${roomId}`)).getByPageBeforeLongtimestamp(longtimestamp, pageSize) } else { return room.getByPageBeforeLongtimestamp(longtimestamp, pageSize) }
      }
    }
    return []
  }

  room (roomId) {
    var room = this.roomMap[roomId]
    if (!room) { return false }
    return room
  }

  onMessage (message) {
    if (message.roomId > 0 && message.data.type === 'message' && !message.data.data.isLotteryAutoMsg) {
      // note: push it by message.data.data, because this is the same nested-level as Warpper.warp() will return.
      this.roomMap[message.roomId].push(message.data)
    }
  }

  onConnect (roomId) {
    console.log(`Room-${roomId} has connected. History Service of Room-${roomId} starts`)
    /* todo: check the roomId is shortID or normalID
    * tofix: if it is shortID, DanmakuService could not receive Danmu
    * these should be fixed together with HistoryService and DanmakuService
    * or add variable security check before calling the actual functions
    */
    if (!this.roomMap[roomId]) {
      var table = new HistoryTable(this.store, `Room-${roomId}`)
      table.query = new Query(table)
      this.roomMap[roomId] = table
      this.roomList.set(roomId, 'true')
    }
  }

  onClose (roomId) {
    console.log(`Room-${roomId} has closed. History Service of Room-${roomId} stops`)
    delete this.roomMap[roomId]
  }
}

export default new HistoryService()
