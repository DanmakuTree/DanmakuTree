import { WebInterfaceBase } from '../../WebInterfaceBase'
import API from './API'
import BiliBiliServices from './Services'

export class BiliBili extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.0.1'
    this.API = API
    this.Services = BiliBiliServices
    this.available.push('API', 'Services')
  }
}

export default new BiliBili()
