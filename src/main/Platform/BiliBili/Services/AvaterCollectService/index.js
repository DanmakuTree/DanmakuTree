import { WebInterfaceBase } from '../../../../WebInterfaceBase'
import API from '../../API'
import { getLogger } from 'log4js'
import { eventBus } from '../../../../EventBus'

export class AvaterCollectService extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.0.5'
    this.storage = {}
    this.promiseList = {}
    this.interval = null
    this.waiting = []
    this.working = []
    this.logger = getLogger('AvaterCollectService')
    var methodList = ['add', 'request', 'verifyUrl', 'wakeup', 'tick', 'fail', 'makeSureInList']
    methodList.forEach((e) => {
      this[e] = this[e].bind(this)
    })
    this.available.push('add', 'request')
    eventBus.on('Platform.BiliBili.Service.AvaterCollectService.push', (uid, url) => {
      this.add(uid, url)
    })
  }

  /**
   * 添加头像地址
   * @param {Number} uid uid
   * @param {String} url 头像地址
   */
  async add (uid, url) {
    // todo: sqlite
    if (this.verifyUrl(url)) {
      this.storage[uid] = url
    }
    if (this.waiting.indexOf(uid) !== -1) {
      this.waiting = this.waiting.filter((e) => { return e !== uid })
      this.promiseList[uid].forEach((e) => {
        try {
          e[0](url)
        } catch (error) {
          // ignore
        }
      })
      delete this.promiseList[uid]
    }
    if (this.working.indexOf(uid) !== -1) {
      this.working = this.working.filter((e) => { return e !== uid })
      this.promiseList[uid].forEach((e) => {
        try {
          e[0](url)
        } catch (error) {
          // ignore
        }
      })
      delete this.promiseList[uid]
    }
  }

  /**
   * 拉取头像地址
   * @param {Number} uid uid
   */
  async request (uid) {
    // todo: sqlite
    if (this.storage[uid]) {
      return this.storage[uid]
    } else {
      if (!this.promiseList[uid]) {
        this.promiseList[uid] = []
      }
      var promise = new Promise((resolve, reject) => {
        this.promiseList[uid].push([resolve, reject])
        this.makeSureInList(uid)
      })
      this.wakeup()
      return promise
    }
  }

  /**
   * 清除所有头像缓存
   */
  async clearAll () {
    this.storage = {}
    // todo:sqlite
  }

  verifyUrl (url) {
    return typeof url === 'string'
  }

  wakeup () {
    if (this.interval === null) {
      this.interval = setInterval(this.tick, 100)
    }
  }

  tick () {
    if (this.waiting.length > 0) {
      var target = this.waiting.pop()
      this.working.push(target)
      API.getUserCard(target, 0).then((e) => {
        if (typeof e.data.card.face === 'string') {
          this.add(target, e.data.card.face)
        } else {
          throw new Error('wrong type: ' + typeof e.data.card.face)
        }
      }).catch((e) => {
        this.logger.error(`fail to get User Card of ${target},msg: ${e.message || JSON.stringify(e)}`)
        this.fail(target)
      })
    } else {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  fail (uid) {
    if (this.working.indexOf(uid) !== -1) {
      this.working = this.working.filter((e) => { return e !== uid })
      this.promiseList[uid].forEach((e) => {
        try {
          e[1](false)
        } catch (error) {
          // ignore
        }
      })
      delete this.promiseList[uid]
    }
  }

  makeSureInList (uid) {
    if (this.working.indexOf(uid) >= 0 || this.waiting.indexOf(uid) >= 0) {
      return true
    } else {
      this.waiting.push(uid)
    }
  }
}

export default new AvaterCollectService()
