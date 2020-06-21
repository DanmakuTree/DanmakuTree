import { WebInterfaceBase } from '../../WebInterfaceBase'
import { createServer } from 'http'
import { Server } from 'ws'
import { eventBus } from '../../EventBus'
import { URL } from 'url'
import { version } from '../../Consts'
import { v4 as uuid } from 'uuid'
import { getLogger } from 'log4js'

const portList = [6233, 6888, 60233, 60666, 60888]
export class WebsocketService extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.0.2'
    this.server = null
    this.wss = null
    this.portIndex = 0
    this.status = 'prepare'
    this.port = portList[this.portIndex]
    this.local = true
    this.connections = {}
    this.server = createServer()
    this.handlerMap = {}
    this.logger = getLogger('WebsocketService')
    const methodList = ['start', 'stop', 'getStatus', 'switchLocal', 'broadcastEvent', 'sendEventToTarget']
    methodList.forEach((e) => {
      this[e] = this[e].bind(this)
      this.available.push(e)
    })
    var selfList = ['onError', 'onListening', 'onUpgrade', 'onRequest', 'onConnection', 'closeHandler', 'messageHandler', 'errorHandler', 'handle']
    selfList.forEach((e) => {
      this[e] = this[e].bind(this)
    })
    this.server.on('error', this.onError)
    this.server.on('listening', this.onListening)
    this.server.on('upgrade', this.onUpgrade)
    this.server.on('request', this.onRequest)
    this.wss = new Server({ noServer: true })
    this.wss.on('connection', this.onConnection)
    eventBus.onRaw('ALLPUBLIC', (e) => {
      if (this.status === 'ready') {
        this.broadcastEvent(e.name, ...e.data)
      }
    })
  }

  async start (local = this.local) {
    if (this.status === 'prepare') {
      this.local = local
      this.portIndex = 0
      this.server.listen(portList[this.portIndex], this.local ? '127.0.0.1' : '0.0.0.0')
    }
  }

  async stop () {
    if (this.status === 'ready') {
      this.server.close()
      this.status = 'prepare'
      return true
    }
    if (this.status === 'prepare') {
      return true
    }
    return false
  }

  async getStatus () {
    return {
      status: this.status,
      port: this.port,
      address: this.server.address
    }
  }

  async switchLocal (local) {
    this.local = local
    if (this.status === 'ready') {
      this.port = portList[this.portIndex]
      this.server.listen(portList[this.portIndex], local ? '127.0.0.1' : '0.0.0.0')
    }
    return this.local
  }

  onError (error) {
    if (error.code === 'EADDRINUSE') {
      if (this.portIndex < 5) {
        this.portIndex++
        this.port = portList[this.portIndex]
        this.server.listen(portList[this.portIndex], this.local ? '127.0.0.1' : '0.0.0.0')
      } else {
        this.status = 'error'
        eventBus.emit('Main.Services.WebsocketService.error', new Error('EADDRINUSE'))
      }
    } else {
      console.log(error)
    }
  }

  onListening () {
    this.status = 'ready'
    eventBus.emit('Main.Services.WebsocektService.listening', this.port)
  }

  onUpgrade (request, socket, head) {
    const pathname = (new URL(request.url, 'ws://0.0.0.0')).pathname
    if (pathname === '/client') {
      this.wss.handleUpgrade(request, socket, head, (ws) => {
        this.wss.emit('connection', ws, request)
      })
    } else {
      socket.destory()
    }
  }

  onRequest (request, response) {
    response.write(`DanmakuTree v${version}`)
    response.end()
  }

  /**
   * 向特定目标发送消息
   * @param {String} eventName 事件名
   * @param {String} target 目标
   * @param  {...any} args 内容
   */
  async sendEventToTarget (eventName, target, ...args) {
    if (typeof eventName !== 'string' && typeof target !== 'string' && target.length > 0) {
      throw new Error()
    }

    Object.keys(this.connections).forEach((key) => {
      const client = this.connections[key]
      if (client.readyState !== client.OPEN) {
        delete this.connections[key]
        return
      }
      if (client.authed) {
        if (target === '') {
          client.send({ 'type': 'event', 'name': eventName, 'data': args })
        } else if (client.type === target) {
          client.send({ 'type': 'event', 'name': eventName, 'data': args })
        }
      }
    })
  }

  broadcastEvent (eventName, ...args) {
    Object.keys(this.connections).forEach((key) => {
      const client = this.connections[key]
      if (client.readyState !== client.OPEN) {
        delete this.connections[key]
        return
      }
      if (client.authed) {
        client.send({ 'type': 'event', 'name': eventName, 'data': args })
      }
    })
  }

  onConnection (socket, request) {
    var key = uuid()
    this.connections[key] = socket
    socket.key = key
    socket.authed = false
    this.logger.info(`[${key}] `)
    socket.on('close', (code, reason) => {
      this.closeHandler(socket, code, reason)
    })
    socket.on('message', (data) => {
      if (typeof data === 'string') {
        try {
          const message = JSON.parse(data)
          this.messageHandler(socket, message)
        } catch (error) {
          socket.close(1007)
        }
      } else {
        socket.close(1003)
      }
    })
    socket.on('error', (error) => {
      this.errorHandler(socket, error)
    })
  }

  /**
   *
   * @param {import('ws')} socket
   * @param {*} code
   * @param {*} reason
   */
  closeHandler (socket, code, reason) {
    this.logger.info(`[${socket.key}] close`, code, reason)
    socket.removeAllListeners()
    socket.on('error', () => {})
    delete this.connections[socket.key]
  }

  /**
   *
   * @param {import('ws')} socket
   * @param {*} message
   */
  messageHandler (socket, message) {
    if (typeof message !== 'object' || typeof message.type !== 'string') {
      socket.close(1008)
      return
    }

    switch (message.type) {
      case 'auth':
        if (socket.authed) {
          socket.close(1008)
          return
        }
        if (typeof message.data !== 'object' || typeof message.data.type !== 'string') {
          socket.close(1008)
          return
        }
        socket.type = message.data.type
        socket.authed = true
        break
      default:
        if (!socket.authed) {
          socket.close(1008)
        }
        if (this.handlerMap[message.type]) {
          try {
            var promise
            if (Array.isArray(message.data)) {
              promise = this.handlerMap[message.type]({}, ...message.data)
            } else {
              promise = this.handlerMap[message.type]({}, message.data)
            }
            promise.then((...data) => {
              if (socket.readyState === socket.OPEN) {
                socket.send(JSON.stringify({
                  'type': message.type,
                  'data': data
                }))
              }
            }).catch((e) => {
              this.logger.error(`Get Error with ${JSON.stringify(message)} , ${JSON.stringify(error)}`)
              socket.close(1011)
            })
          } catch (error) {
            this.logger.error(`Get Error with ${JSON.stringify(message)} , ${JSON.stringify(error)}`)
            socket.close(1011)
          }
        } else {
          socket.close(1008)
        }
        break
    }
  }

  errorHandler (socket, error) {
    socket.close(1011)
    this.logger.warn(`[${socket.key}]Unhandler Error`, error.toString())
  }

  handle (name, handler) {}
}

export default new WebsocketService()
