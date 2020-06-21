import { WebInterfaceBase } from './WebInterfaceBase'
import Services from './Services'
import { version } from './Consts'

export class Main extends WebInterfaceBase {
  constructor () {
    super()
    this.available.push('Services', 'getConfig', 'updateConfig', 'getRoomList', 'updateRoomList', 'getVersion')
    this.Services = Services
  }

  async getConfig () {
    // todo
  }

  async updateConfig () {
    // todo
  }

  async getRoomList () {

  }

  async updateRoomList () {

  }

  async getVersion () {
    return version
  }
}
