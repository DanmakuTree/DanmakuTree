import WebSocket from 'ws'
import { EventEmitter } from 'events'
import Encoder from './Encoder'
import eventBus from '../../../../EventBus'
import { inflateSync } from 'zlib'
import { Warpper } from './Warpper'

export class RoomConnection extends EventEmitter {
  constructor (roomId, uid = 0, token = null, address = 'ws://broadcastlv.chat.bilibili.com:2244/sub') {
    super()
    this.roomId = roomId
    this.encoder = new Encoder()
    this.warpper = new Warpper()
    this.version = 2
    this.authInfo = {
      uid,
      roomid: roomId,
      protover: 2,
      platform: 'web',
      clientver: '1.11.0',
      type: 2,
      key: token
    }
    this.shouldClose = false
    this.connection = new WebSocket(address)
    this.emit('connecting')
    this.onOpen = this.onOpen.bind(this)
    this.onData = this.onMessage.bind(this)
    this.onError = this.onError.bind(this)
    this.onClose = this.onClose.bind(this)
    this.listen()
  }

  listen () {
    this.connection.on('open', this.onOpen)
    this.connection.on('message', this.onMessage)
    this.connection.on('open', this.onOpen)
    this.connection.on('open', this.onOpen)
    this.on('authSucceeded', this.onAuthSucceeded)
  }

  onOpen () {
    this.connection.send(this.encoder.encode({
      protocolVersion: this.version,
      operation: 7,
      body: Buffer.isBuffer(this.authInfo) ? this.authInfo : Buffer.from((JSON.stringify(this.authInfo) || ''))
    }))
  }

  onMessage (data) {
    while (data.length > 0) {
      const packet = this.decoder.decode(data)
      switch (packet.operation) {
        case 3: // heartbeatReply
          eventBus.emit(`Platform.BiliBili.Service.DanmakuService.Message.${this.roomId}`, null, {
            type: 'online',
            data: {
              online: packet.body.readInt32BE(0)
            }
          })
          break
        case 8: // authSuccess
          this.emit('authSuccess')
          break
        case 5: // message
          if (packet.protocolVersion === 2) {
            this.onMessage(inflateSync(packet.body))
          } else {
            try {
              var msg = JSON.parse(packet.body.toString())
              eventBus.emit(`Playform.BiliBIli.Service.DanmakuService.RawMessage.${this.roomId}`)
              var transformMessage = this.warpper.warp(msg)
              if (transformMessage) {
                eventBus.emit(`Platform.BiliBili.Service.DanmakuService.Message.${this.roomId}`, null, transformMessage)
              }
            } catch (error) {
              this.emit('decodeError', error)
            }
          }
          break
        default:
          this.emit('unknownOperation', packet)
          break
      }
    }
  }

  onError (e) {
    this.emit('error', e)
  }

  onClose (code, reason) {
    clearInterval(this.heartbeatTimer)
    this.emit('close', code, reason)
    this.heartbeatTimer = null
    this.connection = null
    if (!this.shouldClose) {
      this.emit('needReconnect', this.roomId)
    }
  }

  reconnect (uid = 0, token = null, address = 'ws://broadcastlv.chat.bilibili.com:2244/sub') {
    this.authInfo = {
      uid,
      roomid: this.roomId,
      protover: 2,
      platform: 'web',
      clientver: '1.11.0',
      type: 2,
      key: token
    }
    this.shouldClose = false
    this.connection = new WebSocket(address)
    this.emit('connecting')
    this.listen()
  }

  disconnect () {
    this.shouldClose = true
    if (this.connection) {
      this.connection.close()
    }
  }

  send (packet) {
    return this.connection.write(this.encoder.encode(packet))
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
    this.heartbeatTimer = setInterval(this.heartbeat.bind(this), 30 * 1000)
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
