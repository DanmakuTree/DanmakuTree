import { v4 as UUID } from 'uuid'
import axios from 'axios'

export class AccountManager {
  constructor () {
    this.accounts = new Map()
  }

  /**
   * 通过cookie添加账号
   * @param {string} cookies cookies
   */
  async addAccountByCookie (cookies) {
    const id = UUID()
    this.accounts.set(id, new Account('web', cookies))
    return id
  }

  /**
   * 通过账号密码登录（使用BiliBili Link模式）
   * @param {string} username
   * @param {string} password
   * @param {string} pubkey
   * @param {string} hash
   * @param {string} challenge
   * @param {string} seccode
   * @param {string} validate
   */
  async addAccountByPassword (username, password, pubkey, hash, challenge, seccode, validate) {

  }

  /**
   * 删除账号
   * @param {string} id 账号id
   */
  async removeAccount (id) {
    return this.accounts.delete(id)
  }

  /**
   * 登出并删除账号
   * @param {string}} id
   */
  async logoutAccount (id) {

  }
}

export class Account {
  constructor (type, cookies, accessKey) {
    this.type = type
    this.cookies = cookies
    this.accessKey = accessKey
  }
}
