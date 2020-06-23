import WebSocket from 'ws'
import { EventEmitter } from 'events'
import Encoder from './Encoder'
import Decoder from './Decoder'
import { eventBus } from '../../../../EventBus'
import { inflateSync } from 'zlib'
import { Warpper } from './Warpper'

export class RoomConnection extends EventEmitter {
  constructor (roomId) {
    super()
    this.roomId = roomId
    this.encoder = new Encoder()
    this.decoder = new Decoder()
    this.warpper = new Warpper()
    this.version = 2
    this.heartbeatTimer = null
    this.connection = null
    this.status = 'waitConfig'
    this.onOpen = this.onOpen.bind(this)
    this.onMessage = this.onMessage.bind(this)
    this.onError = this.onError.bind(this)
    this.onClose = this.onClose.bind(this)
    this.heartbeat = this.heartbeat.bind(this)
    this.onAuthSucceeded = this.onAuthSucceeded.bind(this)
    this.send = this.send.bind(this)
    this.on('authSuccess', this.onAuthSucceeded)
  }

  connect (roomId, uid = 0, token = null, address = 'ws://broadcastlv.chat.bilibili.com:2244/sub') {
    if (this.connection !== null) {
      this.connection.removeAllListeners('open')
      this.connection.removeAllListeners('message')
      this.connection.removeAllListeners('error')
      this.connection.removeAllListeners('close')
      this.connection.on('error', () => {})
      this.connection.close()
      this.clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
      this.connection = null
    }
    this.authInfo = {
      uid,
      roomid: roomId,
      protover: 2,
      platform: 'web',
      clientver: '1.11.0',
      type: 2,
      key: token
    }
    this.status = 'connecting'
    this.shouldClose = false
    this.connection = new WebSocket(address)
    this.emit('connecting')
    this.listen()
  }

  listen () {
    this.connection.on('open', this.onOpen)
    this.connection.on('message', this.onMessage)
    this.connection.on('error', this.onError)
    this.connection.on('close', this.onClose)
  }

  onOpen () {
    this.status = 'authing'
    this.emit('authing')
    this.send({
      protocolVersion: this.version,
      operation: 7,
      body: Buffer.isBuffer(this.authInfo) ? this.authInfo : Buffer.from((JSON.stringify(this.authInfo) || ''))
    })
  }

  onMessage (data) {
    while (data.length > 0) {
      const packet = this.decoder.decode(data)
      switch (packet.operation) {
        case 3: // heartbeatReply
          eventBus.emit('Platform.BiliBili.Service.DanmakuService.Message', {
            roomId: this.roomId,
            data: {
              type: 'online',
              data: {
                online: packet.body.readInt32BE(0)
              }
            }
          })
          break
        case 8: // authSuccess
          this.status = 'connected'
          this.emit('authSuccess')

          break
        case 5: // message
          if (packet.protocolVersion === 2) {
            this.onMessage(inflateSync(packet.body))
          } else {
            try {
              var msg = JSON.parse(packet.body.toString())
              eventBus.emit('Platform.BiliBili.Service.DanmakuService.RawMessage', {
                roomId: this.roomId,
                data: msg
              })
              var transformMessage = this.warpper.warp(msg)
              if (transformMessage) {
                if (Array.isArray(transformMessage)) {
                  transformMessage.forEach((e) => {
                    eventBus.emit('Platform.BiliBili.Service.DanmakuService.Message', {
                      roomId: this.roomId,
                      data: e
                    })
                  })
                } else {
                  eventBus.emit('Platform.BiliBili.Service.DanmakuService.Message', {
                    roomId: this.roomId,
                    data: transformMessage
                  })
                }
              }
            } catch (error) {
              this.emit('decodeError', error, packet)
            }
          }
          break
        default:
          this.emit('unknownOperation', packet)
          break
      }
      data = data.slice(packet.packageLength)
    }
  }

  onError (e) {
    this.emit('error', e)
  }

  onClose (code, reason) {
    clearInterval(this.heartbeatTimer)
    this.status = 'closed'
    this.emit('close', code, reason)
    this.heartbeatTimer = null
    this.connection.removeAllListeners('open')
    this.connection.removeAllListeners('message')
    this.connection.removeAllListeners('error')
    this.connection.removeAllListeners('close')
    this.connection.on('error', () => {})
    this.connection = null
    if (!this.shouldClose) {
      this.status = 'waitConfig'
      this.emit('needReconnect', this.roomId)
    }
  }

  disconnect () {
    this.shouldClose = true
    if (this.connection) {
      this.connection.close()
    }
  }

  send (packet) {
    return this.connection.send(this.encoder.encode(packet))
  }

  /**
   * 发送认证包，一般会在连接上后自动发送
   */
  Auth () {
    this.send({
      protocolVersion: this.version,
      operation: 7,
      body: Buffer.isBuffer(this.authInfo) ? this.authInfo : Buffer.from((JSON.stringify(this.authInfo) || ''))
    })
  }

  onAuthSucceeded (body) {
    this.heartbeat()
    this.heartbeatTimer = setInterval(this.heartbeat, 30 * 1000)
  }

  /**
   * 发送心跳包，一般不需要手动调用
   */
  heartbeat () {
    this.send({
      protocolVersion: this.version,
      operation: 2,
      body: Buffer.from('[object Object]')
    })
  }
}
