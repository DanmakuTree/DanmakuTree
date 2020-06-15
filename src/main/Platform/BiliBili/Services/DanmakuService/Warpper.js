
export const defaultMap = {
  DANMU_MSG (message) {
    var result = { type: 'message', data: {} }
    result.data.comment = message.info[1]
    result.data.user = {
      uid: message.info[2][0],
      username: message.info[2][1],
      isAdmin: !!message.info[2][2],
      platformVIPLevel: (message.info[2][4]) ? 2 : ((message.info[2][3]) ? 1 : 0),
      userLevel: message.info[4][0] || 0,
      roomVIPLevel: message.info[7],
      medal: {
        level: 0,
        label: '',
        anchorUsername: '',
        roomId: 0
      },
      title: message.info[5]
    }
    result.data.validation = {
      ts: message.info[9].ts || 0,
      ct: message.info[9].ct || ''
    }
    if (message[3] && message[3].length > 0) {
      result.data.user.medal = {
        level: message.info[3][0] || 0,
        label: message.info[3][1] || '',
        anchorUsername: message.info[3][2] || '',
        roomId: message.info[3][3]
      }
    }
    return result
  },
  SEND_GIFT (message) {
    var result = { type: 'gift', data: {} }
    result.data.gift = {
      giftId: message.data.giftId,
      giftName: message.data.giftName,
      coinType: message.data.coin_type,
      num: message.data.num,
      price: message.data.price
    }
    result.data.user = {
      uid: message.data.uid,
      username: message.data.uname,
      face: message.data.face
    }
    return result
  },
  WELCOME (message) {
    var result = { type: 'platformVIPwelcome', data: {} }
    result.data.user = {
      uid: message.data.uid,
      username: message.data.uname,
      platformVIPLevel: (message.data.svip ? 2 : (message.data.vip ? 1 : 0))
    }
    return result
  }
}
export class Warpper {
  constructor (map = defaultMap) {
    this.map = defaultMap
  }

  warp (message) {
    try {
      const cmd = message.cmd.split(':')[0]
      if (cmd && this.map[cmd]) {
        const type = typeof this.map[cmd]
        switch (type) {
          case 'function':
            return this.map[cmd](message)
          default:
            break
        }
      }
      return false
    } catch (error) {
      return false
    }
  }
}
export default new Warpper(defaultMap)
