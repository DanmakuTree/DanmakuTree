import { WebInterfaceBase } from '../../../WebInterfaceBase'
import DanmakuService from './DanmakuService'
import FollowerService from './FollowerService'
import AvaterCollectService from './AvaterCollectService'
import HistoryService from './HistoryService'

export class BiliBiliServices extends WebInterfaceBase {
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

export default new BiliBiliServices()
