export class WebInterfaceBase {
  constructor () {
    this.version = '0.0.0'
    this.available = ['getAvailable', 'getVersion']
    this.getAvailable = this.getAvailable.bind(this)
    this.getVersion = this.getVersion.bind(this)
  }

  getVersion () {
    return this.version
  }

  getAvailable () {
    return this.available
  }
}
