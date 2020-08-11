import { WebInterfaceBase } from '../../WebInterfaceBase'
import axios from 'axios'
import https from 'https'
import { isDev } from '../../Consts'

export class API extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.0.1'
    this.deviceId = deviceId()
    this.cookies = '_did=' + this.deviceId
    this.available.push('guestLogin')
    this.axios = createWebAxios(this.cookies)
    var bindList = ['init', 'post', 'guestLogin']
    bindList.forEach((e) => {
      this[e] = this[e].bind(this)
    })
  }

  init () {}

  post (url, body, params) {
    return this.axios.post(url, new URLSearchParams(body), {
      'params': params
    }).then((res) => {
      return res.data
    })
  }

  guestLogin () {
    return this.post('https://id.app.acfun.cn/rest/app/visitor/login', {
      'sid': 'acfun.api.visitor'
    })
  }
}

function createWebAxios (cookies) {
  var headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36'
  }
  if (cookies) {
    headers.Cookie = cookies
  }
  return axios.create({
    baseURL: 'https://api.live.bilibili.com',
    timeout: 5000,
    headers,
    httpsAgent: (isDev ? new https.Agent({ rejectUnauthorized: false }) : undefined)
  })
}

function deviceId () {
  return 'web_' + parseInt(Math.random() * Math.pow(10, 15) * 0.9 + Math.pow(10, 14))
}

export default new API()
