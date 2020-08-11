import { AcFunDanmu } from '../../proto'
import { WebInterfaceBase } from '../../../../WebInterfaceBase'
import { Encoder } from './encoder'
import { Decoder } from './decoder'

export class LiveMessageService extends WebInterfaceBase {
  constructor () {
    super()
    this.encoder = new Encoder()
    this.decoder = new Decoder()
    this.available.push('test')
    var bindlist = ['test']
    bindlist.forEach((e) => {
      this[e] = this[e].bind(this)
    })
    console.log('sth')
  }

  test () {
    var file = Buffer.from('q80AAQAAARIAAABwCA0QnNz9EBgAOFpAAUr1AQgBEvABQ2haaFkyWjFiaTV0YVdSbmNtOTFibVF1WVhCcExuTjBFbUFxdF8xbDNTN3B0Z1Y0dGk1MG4tSFFmbEU0ZmM3bWF5TWhybmJHN3A5dDRxWlg5dko2bDlEVGUxeWRianpFVDdtdnR1bmx4MXpCalNSSGxWSFN4VlY5REwwcnpjc2ZFN1ltMktrV1Rfa3NhYXdFSzQ3dzJJb3ZPY085a0tZRl9QUWFFdnFSQUF3U1ZqMWdwS0I5U1ZJM3VSMjNiU0lnclo3SEZOTFpqM3lSUXdVMTNfdEVjVndvVER6WkhFRW5GSEt4TWdRMVRUWW9CVEFCUAFiCUFDRlVOX0FQUMOGSwH88TCxSjNVW+Z1CP+d1rJTptjPivhlnLo04tBdV27g5FCP0Iw632hYQNk/8bKUwNDhf+gAQv0klv+oAQ+bqycocimCg550bmi/idBODd8A3xAfzYtmHUNGGG1SZKlAdN5Vm4BAX+5nbfheNvs=', 'base64')
    var result = this.decoder.decode(file)
    try {
      AcFunDanmu
    } catch (error) {

    }
    console.log(result)
  }
}
export default new LiveMessageService()
