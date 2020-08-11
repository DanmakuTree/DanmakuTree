import { WebInterfaceBase } from '../../WebInterfaceBase'
import API from './API'
import AcfunService from './Services'
import Database from 'better-sqlite3'
import { DataPath } from '../../Consts'

export class AcFun extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.0.1'
    this.API = API
    this.Services = AcfunService
    this.available.push('API', 'Services')
    this.init = this.init.bind(this)
    this.db = null
  }

  init () {
    this.db = new Database(DataPath + '/config/AcFun.db')
    this.Services.init(this.db)
    this.API.init(this.db)
  }
}

export default new AcFun()
