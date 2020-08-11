
import { Encoder, AcFunPacket } from './encoder'
import { Decoder } from './decoder'
import API from '../../API'
import { result } from 'lodash'
import WebSocket from 'ws'
import { AcFunDanmu } from '../../proto'

const appInfo = {
  appName: 'link-sdk',
  sdkVersion: '1.2.1'
}
const deviceInfo = {
  platformType: 6,
  deviceModel: 'h5',
  imeiMd5: null,
  deviceId: API.deviceId
}
const kpn = 'ACFUN_APP'
const kpf = 'PC_WEB'

export class RoomConnection {
  constructor () {
    this.acSecurity = ''
    this.userId = 0
    this.visitor_st = ''
    this.sequenceId = 0
    this.websocket = null
    this.onOpen = this.onOpen.bind(this)
  }

  connect () {
    API.guestLogin().then((res) => {
      if (res.result === 0) {
        this.acSecurity = res.acSecurity
        this.userId = res.userId
        this.visitor_st = res['acfun.api.visitor_st']
        this.websocket = new WebSocket('wss://link.xiatou.com/')
        this.websocket.on('open', this.onOpen)
      } else {
        throw new Error('Result not 0')
      }
    })
  }

  onOpen () {

  }

  send (data) {
    var packet = new AcFunPacket()
    packet.header = new AcFunDanmu.PacketHeader({
      appId
    })
    this.websocket.send(Encoder())
  }
}
