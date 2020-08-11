import { WebInterfaceBase } from '../../../WebInterfaceBase'
import LiveMessageService from './LiveMessageService'

export class AcfunService extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.0.1'
    this.available.push('LiveMessageService')
    this.LiveMessageService = LiveMessageService
    this.init = this.init.bind(this)
  }

  getServicesList () {
    return ['LiveMessageService']
  }

  init () {

  }
}

export default new AcfunService()
