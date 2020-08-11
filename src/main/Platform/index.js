import { WebInterfaceBase } from '../WebInterfaceBase'
import BiliBili from './BiliBili'
import AcFun from './AcFun'
export class Platform extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.0.1'
    this.available.push('BiliBili', 'AcFun', 'getPlatformList')
    this.BiliBili = BiliBili
    this.AcFun = AcFun
  }

  getPlatformList () {
    return ['BiliBili', 'AcFun']
  }

  init () {
    this.BiliBili.init()
  }
}
