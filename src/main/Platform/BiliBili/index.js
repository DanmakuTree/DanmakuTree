import { WebInterfaceBase } from '../../WebInterfaceBase'
import API from './API'

export class BiliBili extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.0.1'
    this.API = API
    this.Services = new Services()
    this.available.push('API', 'Services')
  }
}

export class Services extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.0.1'
    this.available.push('DanmakuService', 'FollowerService', 'AvaterCollectService')
    this.DanmakuService = require('./Services/DanmakuService')
    this.FollowerService = require('./Services/FollowerService')
    this.AvaterCollectService = require('./Services/AvaterCollectService')
  }

  getServicesList () {
    return ['DanmakuService', 'FollowerService', 'AvaterCollectService']
  }
}

export default new BiliBili()
