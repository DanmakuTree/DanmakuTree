import { WebInterfaceBase } from '../../../../WebInterfaceBase'
import { RoomConnection } from './RoomConnection'
import API from '../../API'
import { eventBus } from '../../../../EventBus'
import { getLogger } from 'log4js'

export class DanmakuService extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.0.1'
    /**
     * @type {RoomConnection[]}
     */
    this.rooms = []
    this.logger = getLogger('DanmakuService')
    var methodList = ['connect', 'forceReconnect', 'disconnect', 'onReconnect', 'getRoomList', 'listen', 'unlisten', 'stop', 'setReconnectTimer']
    methodList.forEach((e) => {
      this[e] = this[e].bind(this)
    })
    this.available.push('connect', 'forceReconnect', 'disconnect', 'getRoomList')
    this.reconnectList = []
    this.reconnectTimer = null
  }

  async connect (roomId) {
    roomId = parseInt(roomId)
    if (roomId < 0 || Number.isNaN(roomId) || !Number.isFinite(roomId)) {
      throw new Error('Bad RoomId')
    }
    if (this.rooms.find((v) => { return v.roomId === roomId })) {
      throw new Error('Already Connected')
    }
    var connection = new RoomConnection(roomId)
    this.listen(connection)
    this.rooms.push(connection)
    API.getDanmuConf(roomId).then((res) => {
      if (res.code === 0) {
        var address = `wss://${res.data.host_server_list[0].host}:${res.data.host_server_list[0].wss_port}/sub`
        connection.connect(roomId, API.uid, res.data.token, address)
      } else {
        this.reconnectList.push(roomId)
        this.setReconnectTimer()
        eventBus.emit('Platform.BiliBili.Service.DanmakuService.control.error', null, res)
      }
    }).catch((error) => {
      this.reconnectList.push(roomId)
      this.setReconnectTimer()
      eventBus.emit('Platform.BiliBili.Service.DanmakuService.control.error', null, error)
    })
    eventBus.emit('Platform.BiliBili.Service.DanmakuService.control.statusUpdate')
  }

  async forceReconnect (roomId) {
    await this.disconnect(roomId, true)
    return this.connect(roomId)
  }

  async disconnect (roomId, force = false) {
    roomId = parseInt(roomId)
    if (roomId < 0 || Number.isNaN(roomId) || !Number.isFinite(roomId)) {
      throw new Error('Bad RoomId')
    }
    var oldConnection = this.rooms.find((v) => { return v.roomId === roomId })
    if (oldConnection != null) {
      oldConnection.disconnect()
      const index = this.rooms.findIndex((e) => { return e === oldConnection })
      this.rooms.splice(index, 1)
      this.unlisten(oldConnection)
      if (!force) {
        oldConnection.once('close', () => {
          this.logger.info(`Room ${oldConnection.roomId} close`)
          eventBus.emit('Platform.BiliBili.Service.DanmakuService.control.statusUpdate')
        })
      }
    }
    eventBus.emit('Platform.BiliBili.Service.DanmakuService.control.statusUpdate')
  }

  onReconnect (roomId) {
    this.reconnectList.push(roomId)
    this.setReconnectTimer()
  }

  getRoomList () {
    return this.rooms.map((e) => { return { roomId: e.roomId, status: e.status } })
  }

  listen (connection) {
    ['connecting', 'authing', 'authSuccess', 'close', 'needReconnect'].forEach((e) => {
      connection.on(e, () => {
        this.logger.info(`Room ${connection.roomId} ${e}`)
        eventBus.emit('Platform.BiliBili.Service.DanmakuService.control.statusUpdate')
      })
    })
    connection.on('needReconnect', this.onReconnect)
    connection.on('decodeError', (e, p) => {
      this.logger.error(`Room ${connection.roomId} Decode Error ${e.toString()} in packet ${JSON.stringify(p)}`)
    })
    connection.on('unknownOperation', (e) => {
      this.logger.warn(`Room ${connection.roomId} caught Unknown Operation in packet ${JSON.stringify(e)}`)
    })
    connection.on('error', (err) => {
      this.logger.error(`Room ${connection.roomId} Error ${err.toString()}`)
    })
  }

  /**
   *
   * @param {RoomConnection} connection
   */
  unlisten (connection) {
    ['connecting', 'authing', 'authSuccess', 'close', 'needReconnect', 'decodeError', 'unknownOperation', 'error'].forEach((e) => {
      connection.removeAllListeners(e)
    })
    connection.on('error', () => {})
  }

  setReconnectTimer () {
    if (this.reconnectTimer === null) {
      this.reconnectTimer = setInterval(() => {
        if (this.reconnectList.length > 0) {
          var target = this.reconnectList.shift()
          var connection = this.rooms.find((v) => { return v.roomId === target })
          if (connection != null && connection.status === 'waitConfig' && !connection.shouldClose) {
            API.getDanmuConf(target).then((res) => {
              if (res.code === 0) {
                if (connection.status === 'waitConfig' && !connection.shouldClose) {
                  var address = `wss://${res.data.host_server_list[0].host}:${res.data.host_server_list[0].wss_port}/sub`
                  connection.connect(target, API.uid, res.data.token, address)
                }
              } else {
                eventBus.emit('Platform.BiliBili.Service.DanmakuService.control.error', null, res)
                this.reconnectList.push(target)
              }
            }).catch((error) => {
              eventBus.emit('Platform.BiliBili.Service.DanmakuService.control.error', null, error)
            })
          }
        } else {

        }
      }, 1000)
    }
  }

  stop () {
    this.rooms.forEach((e) => {
      this.disconnect(e.roomId)
    })
    clearInterval(this.reconnectTimer)
    this.reconnectTimer = null
  }
}

export default new DanmakuService()
