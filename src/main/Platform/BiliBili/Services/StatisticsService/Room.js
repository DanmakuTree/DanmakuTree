import API from '../../API'
import { throttle } from 'lodash'
import { getLogger } from 'log4js'
import { StatisticsTable } from './StatisticsTable'
import { RoomLiveTable } from './RoomLiveTable'
import { v4 as UUID } from 'uuid'

const columns = [
  { name: 'user', type: 'INTEGER', displayName: '5分钟内活动用户数' },
  { name: 'danmu', type: 'INTEGER', displayName: '1分钟内弹幕量' },
  { name: 'gold', type: 'NUMERIC', displayName: '1分钟内氪金量' },
  { name: 'totalUser', type: 'INTEGER', displayName: '总活动用户数' },
  { name: 'totalDanmu', type: 'INTEGER', displayName: '总弹幕数' },
  { name: 'totalGold', type: 'NUMERIC', displayName: '总氪金量' }
]

const logger = getLogger('StatisticsService')
export class Room {
  constructor (roomId, db) {
    this.roomId = roomId
    this.db = db
    this.userMap = {}
    this.giftList = []
    this.danmuList = []
    this.totalDanmu = 0
    this.totalGold = 0
    var methodList = ['onConnect', 'action', 'onGift', 'onDanmu', 'onUser', 'getReport', 'tick', 'onClose', 'setLiveAutoCutTimeout', 'clearLiveAutoCutTimeout', 'onLiveStart', 'onLiveEnd', 'finishTickReport']
    this.interval = null
    this.timeout = null
    /**
     * @type {"LIVE"|"PREPARE"}
     */
    this.status = 'PREPARE'
    methodList.forEach((e) => { this[e] = this[e].bind(this) })
    // 处理直播中途断连
    this.closeThrottle = throttle(() => {
      this.setLiveAutoCutTimeout()
    }, 5 * 60 * 1000, { leading: true })
    this.isConnected = false
    this.roomliveList = new RoomLiveTable(this.db, `Room-${roomId}`)
    this.currentLiveId = ''
    this.currentLiveTable = null
    this.lastReport = {}
    // TODO:sqlite
  }

  onConnect () {
    API.getRoomInfo(this.roomId).then((e) => {
      if (e.data.live_status === 1) {
        if (this.status !== 'LIVE') {
          this.status = 'LIVE'
          this.onLiveStart()
        }
      } else {
        if (this.status !== 'PREPARE') {
          this.status = 'PREPARE'
          this.onLiveEnd()
        }
      }
    }).catch((e) => {
      logger.error(e)
    })

    // 处理直播中途断连
    this.closeThrottle.cancel()
    this.clearLiveAutoCutTimeout()

    this.isConnected = true
  }

  action (item) {
    if (item.type === 'live') {
      this.onLiveStart()
    }
    if (item.type === 'prepare') {
      this.onLiveEnd()
    }
    if (item.type === 'cut') {
      this.onLiveEnd()
    }
    if (this.status !== 'LIVE') {
      return
    }
    if (item.data && item.data.comment) {
      this.onDanmu(item.data)
    }
    if (item.data && item.data.gift && item.data.gift.coinType === 'gold') {
      this.onGift(item.data)
    }
    if (item.data && item.data.user && item.data.user.uid) {
      this.onUser(item.data)
    }
  }

  onGift (data) {
    this.giftList.push({
      num: data.gift.num * data.gift.price / 1000, // 1元=1000金瓜子
      timestamp: Date.now()
    })
    this.totalGold += data.gift.num * data.gift.price / 1000
  }

  onDanmu () {
    this.danmuList.push({
      timestamp: Date.now()
    })
    this.totalDanmu++
  }

  onUser (data) {
    this.userMap[data.user.uid] = Date.now()
  }

  tick () {
    var report = this.getReport()
    this.finishTickReport(report)
  }

  getReport () {
    var now = Date.now()
    var report = {
      time: now,
      gold: 0,
      totalDanmu: this.totalDanmu,
      totalGold: this.totalGold,
      totalUser: Object.keys(this.userMap).length
    }

    this.giftList = this.giftList.filter((e) => {
      if (now - e.timestamp <= 60000) {
        report.gold += e.num
        return true
      } else {
        return false
      }
    })

    this.danmuList = this.danmuList.filter((e) => {
      return now - e.timestamp <= 60000
    })
    report.danmu = this.danmuList.length
    var user = Object.keys(this.userMap)
    user = user.filter((e) => {
      return now - this.userMap[e] <= 5 * 60000
    })
    report.user = user.length
    return report
  }

  onClose () {
    this.isConnected = false
    if (this.status === 'LIVE') {
      this.closeThrottle()
    }
  }

  setLiveAutoCutTimeout () {
    this.timeout = setTimeout(() => {
      if (this.status !== 'PREPARE' && this.isConnected === false) {
        this.status = 'PREPARE'
        this.onLiveEnd()
      }
      this.timeout = null
    }, 5 * 60 * 1000) // 一般断连5分钟以上会被切掉
  }

  clearLiveAutoCutTimeout () {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    this.closeThrottle.cancel()
  }

  onLiveStart () {
    if (this.interval === null) {
      this.status = 'LIVE'
      this.totalDanmu = 0
      this.totalGold = 0
      this.userMap = {}
      this.interval = setInterval(this.tick, 30 * 1000)
      this.currentLiveId = UUID()
      this.currentLiveTable = new StatisticsTable(this.db, 'Live-' + this.currentLiveId, columns)
      this.currentLiveTable.push({
        time: Date.now(),
        gold: 0,
        user: 0,
        danmu: 0,
        totalGold: 0,
        totalDanmu: 0,
        totalUser: 0
      })
      this.roomliveList.push({ startTime: Date.now(), endTime: Date.now(), columns: JSON.stringify(columns), id: this.currentLiveId, other: '' })
    }
  }

  onLiveEnd () {
    this.status = 'PREPARE'
    if (this.interval !== null) {
      clearInterval(this.interval)
      this.tick()
      this.interval = null
    }
    this.currentLiveTable = null
    this.currentLiveId = null
    this.totalDanmu = 0
    this.totalGold = 0
    this.userMap = {}
  }

  finishTickReport (report) {
    this.lastReport = report
    if (this.currentLiveTable != null) {
      this.currentLiveTable.push(report)
    }
    if (this.currentLiveId != null) {
      this.roomliveList.updateEndTime(this.currentLiveId, report.time)
    }
  }

  manualReport () {
    if (this.status !== 'LIVE') {
      return {}
    } else {
      return this.lastReport
    }
  }
}
