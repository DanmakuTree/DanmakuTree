import { WebInterfaceBase } from '../../../../WebInterfaceBase'
import { RoomConnection } from './RoomConnection'
import { AppInfo } from 'electron-builder'
import API from '../../API'
import { eventBus } from '../../../../EventBus'

export class DanmakuService extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.0.1'
    /**
     * @type {RoomConnection[]}
     */
    this.rooms = []
  }

  async connect (roomId) {
    roomId = parseInt(roomId)
    if (roomId < 0 || Number.isNaN(roomId) || Number.isFinite(roomId)) {
      throw new Error('Bad RoomId')
    }
    if (this.rooms.find((v) => { return v.roomId === roomId })) {
      throw new Error('Already Connected')
    }
    API.getDanmuConf(roomId).then((res) => {
      if (res.code === 0) {
        var connection = new RoomConnection(roomId)
        var address = `wss://${res.data.host_server_list[0].host}:${res.data.host_server_list[0].wss_port}`
        connection.connect(roomId, API.uid, res.data.token, address)
      } else {
        eventBus.emit('Platform.BiliBili.Service.DanmakuService.control.error', null, res)
      }
    }).catch((error) => {
      eventBus.emit('Platform.BiliBili.Service.DanmakuService.control.error', null, error)
    })
  }

  forceReconnect (roomId) {
    roomId = parseInt(roomId)
    if (roomId < 0 || Number.isNaN(roomId) || Number.isFinite(roomId)) {
      throw new Error('Bad RoomId')
    }
    var oldConnection = this.rooms.find((v) => { return v.roomId === roomId })
    oldConnection.disconnect()
  }

  disconnect () {

  }

  onReconnect () {

  }

  getRoomList () {
    return this.rooms.map((e) => { return { roomId: e.roomId, status: e.status } })
  }

  stop () {}
}

export default new DanmakuService()
