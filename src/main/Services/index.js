import { WebInterfaceBase } from '../WebInterfaceBase'
import WebsocketService from './WebsocketService'

export class Services extends WebInterfaceBase {
  constructor () {
    super()
    this.available.push('WebsocketService')
    this.WebsocketService = WebsocketService
  }

  init () {
  }
}
export default new Services()
