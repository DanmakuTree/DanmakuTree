
export const defaultMap = {
  DANMU_CMD (message) {
    var result = {
      type: 'message',
      data: {
        comment: message.info[1],
        danmakuSetting: {
          ka: message.info[0][0],
          mode: message.info[0][1], // 4:bottom 6:reverse 1:scroll 5:top
          fontsize: message.info[0][2],
          color: message.info[0][3],
          sendTime: message.info[0][4],
          dmid: message.info[0][5],
          // [0][6].[0][7],[0][8]
          type: message.info[0][9],
          chatBubbleType: message.info[0][10]
        },
        userInfo: {
          uid: message.info[2][0],
          uname: message.info[2][1],
          isAdmin: !!message.info[2][2],
          isVip: !!message.info[2][3],
          isSvip: !!message.info[2][4],
          rank: message.info[2][5],
          verify: !!message.info[2][6],
          usernameColor: message.info[2][7] || ''
        },
        medal: {
          level: message.info[3][0],
          label: message.info[3][1] || '--',
          anchorUsername: message.info[3][2] || '--',
          shortRoomID: message.info[3][3], // not right
          unknown: message.info[3][4] || null, // in official code......
          special: message.info[3][5] || ''
        },
        linkLevel: {
          level: message.info[4][0],
          // [4][1] [4][2]
          rank: message.info[4][3]
        },
        title: message.info[5],
        guardLevel: message.info[7],
        validation: {
          ts: message.info[9].ts || 0,
          ct: message.info[9].ct || ''
        }
      }
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
      if (message.cmd && this.map[message.cmd]) {
        const type = typeof this.map[message.cmd]
        switch (type) {
          case 'function':
            return this.map[message.cmd](message)
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
