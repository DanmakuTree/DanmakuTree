import { eventBus } from '../../../../EventBus'

export const defaultMap = {
  DANMU_MSG (message) {
    var result = { type: 'message', data: {} }
    result.data.comment = message.info[1]
    result.data.longtimestamp = message.info[0][4]
    result.data.timestamp = message.info[9].ts || 0
    result.data.isLotteryAutoMsg = !!message.info[0][9]
    result.data.msgFrameValue = message.info[0][10]
    result.data.user = {
      uid: message.info[2][0],
      username: message.info[2][1],
      isAdmin: !!message.info[2][2],
      platformVIPLevel: (message.info[2][4]) ? 2 : ((message.info[2][3]) ? 1 : 0),
      userLevel: message.info[4][0] || 0,
      roomVIPLevel: message.info[7],
      medal: {
        level: message.info[3][0] || 0,
        label: message.info[3][1] || '',
        anchorUsername: message.info[3][2] || '',
        roomId: message.info[3][3] || 0
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
      username: message.data.uname
    }
    sendFace(message.data.uid, message.data.face)
    return result
  },
  WELCOME (message) {
    var result = { type: 'welcomePlatformVIP', data: {} }
    result.data.user = {
      uid: message.data.uid,
      username: message.data.uname,
      platformVIPLevel: (message.data.svip ? 2 : (message.data.vip ? 1 : 0))
    }
    return result
  },
  GUARD_BUY (message) {
    var result = {
      type: 'gift',
      data: {
        gift: {
          giftId: (() => {
            try {
              parseInt(message.data.role_name)
            } catch (error) {
              return 10000 + parseInt(message.data.guard_level)
            }
          })(),
          giftName: message.data.gift_name,
          coinType: 'gold',
          num: message.data.num,
          price: message.data.price
        },
        user: {
          uid: message.data.uid,
          username: message.data.username
        }
      }
    }
    return result
  },
  SUPER_CHAT_MESSAGE (message) {
    var result = {
      type: 'superchat',
      data: {
        comment: message.data.message,
        gift: {
          giftId: 12000,
          giftName: '醒目留言',
          coinType: 'gold',
          price: message.data.price * message.data.rate,
          num: 1
        },
        user: {
          uid: message.data.uid,
          username: message.data.user_info.uname,
          roomVIPLevel: message.data.user_info.guard_level,
          userLevel: message.data.user_info.user_level,
          platformVIPLevel: (message.data.user_info.is_vip) ? 2 : ((message.data.user_info.is_svip) ? 1 : 0),
          title: message.data.user_info.title,
          medal: ((medalInfo) => {
            if (typeof medalInfo !== 'object') {
              return undefined
            } else {
              return {
                level: medalInfo.medal_level,
                label: medalInfo.medal_name,
                anchorUsername: medalInfo.anchor_uname,
                roomId: medalInfo.anchor_roomid
              }
            }
          })(message.data.medal_info)
        },
        superchat: {
          id: message.data.id,
          time: message.data.time,
          startTime: message.data.start_time,
          endTime: message.data.end_time,
          price: message.data.price,
          rate: message.data.rate
        },
        validation: {
          ts: message.data.ts,
          ct: message.data.token
        }
      }
    }
    sendFace(message.data.user_info.uid, message.data.user_info.face)
    return result
  },
  WELCOME_GUARD (message) {
    var result = {
      type: 'welcomeRoomVIP',
      data: {
        user: {
          uid: message.data.uid,
          name: message.data.username,
          roomVIPLevel: message.data.guard_level
        }
      }
    }
    return result
  },
  SUPER_CHAT_MESSAGE_DELETE (message) {
    var result = []
    if (Array.isArray(message.ids)) {
      message.ids.forEach((e) => {
        result.push({
          type: 'removeSuperChat',
          data: { id: e }
        })
      })
      return result
    } else {
      return false
    }
  },
  ROOM_BLOCK_MSG (message) {
    return {
      type: 'block',
      data: {
        user: {
          uid: message.uid,
          username: message.uname
        }
      }
    }
  },
  LIVE (message) {
    return {
      type: 'live'
    }
  },
  PREPARING (message) {
    return {
      type: 'prepare'
    }
  },
  CUT_OFF (message) {
    return {
      type: 'cut',
      data: {
        message: message.msg
      }
    }
  },
  WARNING (message) {
    return {
      type: 'warn',
      data: {
        message: message.msg
      }
    }
  },
  ROOM_CHANGE (message) {
    return {
      type: 'roomInfoChange',
      data: {
        title: message.data.title,
        areaId: message.data.area_id,
        parentAreaId: message.data.parent_area_id,
        areaName: message.data.area_name,
        parentAreaName: message.data.parent_area_name
      }
    }
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

function sendFace (uid, face) {
  eventBus.emit('Platform.BiliBili.Service.AvaterCollectService.push', uid, face)
}
