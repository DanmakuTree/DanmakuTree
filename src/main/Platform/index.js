import { WebInterfaceBase } from '../WebInterfaceBase'
import { BiliBili } from './BiliBili'
export class Platform extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.0.1'
    this.available.push('BiliBili', 'getPlatformList')
    this.BiliBili = BiliBili
  }

  getPlatformList () {
    return ['BiliBili']
  }
}
