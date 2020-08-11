export class WebsocketServiceClient extends EventTarget {
  constructor (url, portlist) {
    super()
    this.portlist = portlist
    this.url = url
  }

  __startConnect () {

  }

  /**
   *
   * @param {WebSocket} socket websocket
   */
  __listenWebsocket (socket) {
    socket.addEventListener('open')
  }
}
