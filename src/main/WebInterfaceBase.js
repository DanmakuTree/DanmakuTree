export class WebInterfaceBase {
  constructor () {
    this.version = '0.0.0'
    this.available = ['getAvaliable', 'getVersion']
  }

  getVersion () {
    return this.version
  }

  getAvaliable () {
    return this.available
  }
}
