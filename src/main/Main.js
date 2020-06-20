import { WebInterfaceBase } from './WebInterfaceBase'
import Services from './Services'

export class Main extends WebInterfaceBase {
  constructor () {
    super()
    this.available.push('Services', 'getConfig', 'updateConfig')
    this.Services = Services
  }

  async getConfig () {
    // todo
  }

  async updateConfig () {
    // todo
  }
}
