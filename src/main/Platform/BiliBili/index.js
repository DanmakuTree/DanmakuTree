import { WebInterfaceBase } from '../../WebInterfaceBase'
import API from './API'
import DanmakuService from './Services/DanmakuService'
import FollowerService from './Services/FollowerService'
import AvaterCollectService from './Services/AvaterCollectService'
import HistoryService from './Services/HistoryService'

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
    this.available.push('DanmakuService', 'FollowerService', 'AvaterCollectService', 'HistoryService')
    this.DanmakuService = DanmakuService
    this.FollowerService = FollowerService
    this.AvaterCollectService = AvaterCollectService
    this.HistoryService = HistoryService
  }

  getServicesList () {
    return ['DanmakuService', 'FollowerService', 'AvaterCollectService', 'HistoryService']
  }
}

export default new BiliBili()
