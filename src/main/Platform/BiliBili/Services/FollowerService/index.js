import { WebInterfaceBase } from '../../../../WebInterfaceBase'
import API from '../../API'
import { eventBus } from '../../../../EventBus'
import { getLogger } from 'log4js'

export class FollowerService extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.0.2'
    this.targetUID = 0
    this.recent = []
    this.inited = false
    this.lastTime = Math.floor(Date.now() / 1000)
    this.interval = null
    this.errorTime = 0
    this.lastTotal = 0
    this.logger = getLogger('FollowerService')
    eventBus.registerPublicEvent('Platform.BiliBili.Service.FollowerService.message')
    eventBus.registerPublicEvent('Platform.BiliBili.Service.FollowerService.statuUpdate')
    var methodlist = ['setTarget', 'start', 'tick', 'stop', 'getStatus']
    methodlist.forEach((e) => {
      this[e] = this[e].bind(this)
    })
    this.available.push('setTarget', 'start', 'stop', 'getStatus')
  }

  /**
   * 设定目标uid
   * @param {Number} uid 目标uid
   */
  async setTarget (uid) {
    this.targetUID = uid
    this.logger.info('set Target ' + uid)
    this.recent = []
    this.inited = false
    this.lastTime = Math.floor(Date.now() / 1000)
    this.lastTotal = 0
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
      this.start()
    }
    eventBus.emit('Platform.BiliBili.Service.FollowerService.statuUpdate', this.getStatus())
    return uid
  }

  async start () {
    if (this.inited && this.interval) {
      return true
    } else if (this.interval) {
      this.stop()
    }
    this.lastTime = Math.floor(Date.now() / 1000)
    this.logger.info('starting')
    this.interval = setInterval(this.tick, 15 * 1000)
    eventBus.emit('Platform.BiliBili.Service.FollowerService.statuUpdate', this.getStatus())
    var latestData = await API.getFollowersList(this.targetUID, 0, 20)
    if (latestData.code === 0 && Array.isArray(latestData.data.list)) {
      var biggestTime = 0
      latestData.data.list.forEach((e) => {
        if (typeof e.mid === 'number' || typeof e.mid === 'string') {
          e.mid = parseInt(e.mid)
        } else {
          this.stop()
          throw new Error('API Break')
        }
        this.recent.push(e.mid)
        if (biggestTime < e.mtime) {
          biggestTime = e.mtime
        }
        eventBus.emit('Platform.BiliBili.Service.AvaterCollectService.push', parseInt(e.mid), e.face)
      })
      if (latestData.data.list.length > 0) {
        this.lastTime = biggestTime
      }
    }
    this.inited = true
    this.logger.info('ready')
    eventBus.emit('Platform.BiliBili.Service.FollowerService.statuUpdate', this.getStatus())
    eventBus.emit('Platform.BiliBili.Service.FollowerService.message', { 'type': 'update', 'uid': this.targetUID, 'total': latestData.data.total })
  }

  async tick () {
    if (this.inited) {
      try {
        var latestData = await API.getFollowersList(this.targetUID, 0, 20)
        if (latestData.code === 0 && Array.isArray(latestData.data.list)) {
          var biggestTime = this.lastTime
          latestData.data.list.forEach((e) => {
            if (typeof e.mid === 'number' || typeof e.mid === 'string') {
              e.mid = parseInt(e.mid)
            } else {
              this.stop()
              throw new Error('API Break')
            }
            if (this.recent.indexOf(e.mid) !== -1) {
              return
            }
            this.recent.push(e.mid)
            if (e.mtime > this.lastTime) {
              eventBus.emit('Platform.BiliBili.Service.FollowerService.message', { 'type': 'newfan', 'target': this.targetUID, 'user': e })
              if (biggestTime < e.mtime) {
                biggestTime = e.mtime
              }
            }
            eventBus.emit('Platform.BiliBili.Service.AvaterCollectService.push', parseInt(e.mid), e.face)
          })
          this.lastTime = biggestTime
        }
        if (this.lastTotal !== latestData.data.total) {
          this.lastTotal = latestData.data.total
          eventBus.emit('Platform.BiliBili.Service.FollowerService.message', { 'type': 'update', 'uid': this.targetUID, 'total': latestData.data.total })
        }
        this.errorTime = 0
      } catch (error) {
        this.logger.error(error)
        this.errorTime++
        if (this.errorTime >= 5) {
          this.stop()
          this.logger.error('Reach Max Error time, stop it.')
        }
      }
    }
  }

  stop () {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
      this.logger.info('stop')
      eventBus.emit('Platform.BiliBili.Service.FollowerService.statuUpdate', this.getStatus())
    }
    this.errorTime = 0
  }

  getStatus () {
    if (this.inited && this.interval) {
      return { 'status': 'ready', 'targetUID': this.targetUID }
    } else if (this.interval) {
      return { 'status': 'starting', 'targetUID': this.targetUID }
    } else {
      return { 'status': 'stop', 'targetUID': this.targetUID }
    }
  }
}

export default new FollowerService()
