import { WebInterfaceBase } from './WebInterfaceBase'
import Services from './Services'
import { version } from './Consts'
import { dialog } from 'electron'
import { eventBus } from './EventBus'

export class Main extends WebInterfaceBase {
  constructor () {
    super()
    this.available.push('Services', 'getConfig', 'updateConfig', 'getRoomList', 'updateRoomList', 'getVersion')
    this.Services = Services
    eventBus.registerPublicEvent('Main.quit')
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

  async quit () {
    dialog.showMessageBox({
      type: 'warning',
      message: '真的要退出弹幕树吗？',
      buttons: ['是', '否'],
      defaultId: 0,
      cancelId: 1
    }).then((res) => {
      if (res.response === 0) {
        eventBus.emit('Main.quit')
      }
    })
  }

  async getVersion () {
    return version
  }
}
