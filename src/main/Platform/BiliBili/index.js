import { WebInterfaceBase } from '../../WebInterfaceBase'
import API from './API'
import BiliBiliServices from './Services'
import Database from 'better-sqlite3'
import { DataPath } from '../../Consts'

export class BiliBili extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.0.1'
    this.API = API
    this.Services = BiliBiliServices
    this.available.push('API', 'Services')
    this.init = this.init.bind(this)
    this.db = null
  }

  init () {
    this.db = new Database(DataPath + '/config/BiliBili.db')
    this.Services.init(this.db)
    this.API.init(this.db)
  }
}

export default new BiliBili()
