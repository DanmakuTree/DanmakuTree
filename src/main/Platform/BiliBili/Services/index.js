import { WebInterfaceBase } from '../../../WebInterfaceBase'
import DanmakuService from './DanmakuService'
import FollowerService from './FollowerService'
import AvaterCollectService from './AvaterCollectService'
import HistoryService from './HistoryService'
import StatisticsService from './StatisticsService'

export class BiliBiliServices extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.0.1'
    this.available.push('DanmakuService', 'FollowerService', 'AvaterCollectService', 'HistoryService', 'StatisticsService')
    this.DanmakuService = DanmakuService
    this.FollowerService = FollowerService
    this.AvaterCollectService = AvaterCollectService
    this.HistoryService = HistoryService
    this.StatisticsService = StatisticsService
    this.init = this.init.bind(this)
  }

  getServicesList () {
    return ['DanmakuService', 'FollowerService', 'AvaterCollectService', 'HistoryService', 'StatisticsService']
  }

  init () {
    this.StatisticsService.init()
    this.HistoryService.init()
  }
}

export default new BiliBiliServices()
