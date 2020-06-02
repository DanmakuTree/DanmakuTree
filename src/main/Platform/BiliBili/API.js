import axios from 'axios'
import crypto from 'crypto'
import https from 'https'
import { isDev } from '../../Consts'
import BiliBiliConsts from './Consts'

export class API {
  constructor () {
    this.accessKey = ''
    this.uid = 0
    this.buvid = RandomID(64)
    this.mobileAxios = axios.create({
      baseURL: 'https://api.live.bilibili.com',
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 BiliLiveDroid/2.0.0 bililive',
        // 'APP-KEY': 'android',
        'Buvid': RandomID(37)
        // env: 'prod'
      },
      httpsAgent: (isDev ? new https.Agent({ rejectUnauthorized: false }) : undefined)
    })
    this.loginInfo = null
    this.cookies = null
  }

  /**
   * 获取加密密钥
   */
  async getKey () {
    const data = {
    }
    return (await this.mobileAxios.post('https://passport.bilibili.com/api/oauth2/getKey',
      sign(data, BiliBiliConsts.loginAppKey, BiliBiliConsts.loginSecretkey, BiliBiliConsts.platform))).data
  }

  /**
   * 登录
   * @param {string} username 用户名(手机号、邮箱)
   * @param {string} password 密码
   * @param {string} pubkey pubkey
   * @param {string} hash hash
   */
  async mobilelogin (username, password, pubkey, hash, challenge, seccode, validate) {
    const data = {
      username,
      password: RSAPassword(password, pubkey, hash)
    }
    if (challenge) {
      data.challenge = challenge
    }
    if (seccode) {
      data.seccode = encodeURIComponent(seccode)
    }
    if (validate) {
      data.validate = validate
    }
    const loginRes = (await this.mobileAxios.post('https://passport.bilibili.com/api/v3/oauth2/login',
      sign(data, BiliBiliConsts.loginAppKey, BiliBiliConsts.loginSecretkey, BiliBiliConsts.platform))).data
    if (loginRes.code === 0) {
      this.loginInfo = loginRes.data
      this.accessKey = loginRes.data.token_info.access_token
    }
    return loginRes
  }

  /**
   * 获取用户直播信息
   */
  async getUserLiveInfo () {
    if (this.loginInfo === null) {
      return { code: -101, message: '账号未登录', ttl: 1 }
    }
    const data = {
      access_key: this.accessKey,
      uId: this.loginInfo.token_info.mid
    }
    return (await this.mobileAxios.get('/xlive/app-blink/v1/room/GetInfo', {
      params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
    })).data
  }

  /**
   * 拉取分区列表
   */
  async getAreaList () {
    const data = {
      access_key: this.accessKey
    }
    return (await this.mobileAxios.get('/room/v1/Area/getList', {
      params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
    })).data
  }

  /**
   * 获取最近三个分区
   * @param {Number} roomId 房间号
   */
  async getMyChooseArea (roomId) {
    const data = {
      access_key: this.accessKey,
      roomid: roomId
    }
    return (await this.mobileAxios.get('/room/v1/Area/getMyChooseArea', {
      params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
    })).data
  }

  /**
   * 拉取封面列表
   * @param {Number} roomId 房间号
   */
  async getCoverList (roomId) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId
    }
    return (await this.mobileAxios.get('/room/v1/Cover/get_list', {
      params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
    })).data
  }

  /**
   * 设置封面
   * @param {Number} roomId 房间号
   * @param {Number} picId 封面图片id
   */
  async setCover (roomId, picId) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId,
      pic_id: picId
    }
    return (await this.mobileAxios.post('/room/v1/Cover/update',
      sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform))).data
  }

  /**
   * 拉取分区自定义Tag
   * @param {Number} areaId 分区ID
   * @param {Number} parentAreaId 大分区ID
   */
  async getLiverCustomTags (areaId, parentAreaId) {
    const data = {
      access_key: this.accessKey,
      area_id: areaId,
      parent_area_id: parentAreaId
    }
    return (await this.mobileAxios.get('/room/v3/Area/getLiverCustomTags', {
      params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
    })).data
  }

  /**
   * 设置房间分区自定义标签
   * @param {Number} roomId 房间号
   * @param {Number} tagId tagId
   */
  async setLiverCustomTags (roomId, tagId) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId,
      tag_id: tagId
    }
    return (await this.mobileAxios.get('/room/v3/Area/setLiverCustomTag', {
      params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
    })).data
  }

  /**
   * 更新房间信息
   * @param {object} data 数据
   */
  async updateRoomInfo (data) {
    data.access_key = this.accessKey
    return (await this.mobileAxios.post('/room/v1/Room/update', sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
    )).data
  }

  /**
   * 设置房间标题
   * @param {Number} roomId 房间号
   * @param {string} title 房间标题
   */
  async setRoomTitle (roomId, title) {
    return this.updateRoomInfo({
      room_id: roomId,
      title
    })
  }

  /**
   * 设置房间分区
   * @param {Number} roomId 房间号
   * @param {Number} parentAreaId 大分区ID
   * @param {Number} areaId 分区ID
   */
  async setRoomArea (roomId, parentAreaId, areaId) {
    return this.updateRoomInfo({
      parent_area_id: parentAreaId,
      room_id: roomId,
      area_id: areaId
    })
  }

  /**
   * 开始直播
   * @param {Number} roomId 房间号
   * @param {Number} areaId 分区id
   * @param {1|2} type 类型(1=竖屏 2=横屏)(移动登录模式下)
   */
  async startLive (roomId, areaId, type = 2) {
    const data = {
      access_key: this.accessKey,
      area_v2: areaId,
      room_id: roomId,
      build: 4700011,
      type
    }
    return (await this.mobileAxios.post('/room/v1/Room/startLive', sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform))).data
  }

  /**
   * 停止直播
   * @param {Number} roomId 房间号
   */
  async stopLive (roomId) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId
    }
    return (await this.mobileAxios.post('/room/v1/Room/stopLive', sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform))).data
  }

  /**
   * 获取语音连麦能力
   * @param {Number} roomId 房间号
   */
  async getRoomVoiceJoinAbility (roomId) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId
    }
    return (await this.mobileAxios.get('/av/v1/VoiceJoinAnchor/RoomCan', {
      params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
    })).data
  }

  /**
   * 设置语音连麦开关
   * @param {Number} roomId 房间号
   * @param {number|boolean} status 开关
   */
  async setRoomVoiceJoinSwitch (roomId, status) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId,
      status: typeof status === 'number' ? status : (status ? 1 : 2)
    }
    return (await this.mobileAxios.get('/av/v1/VoiceJoinAnchor/RoomSwitch', {
      params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
    })).data
  }

  /**
   * 获取语音连麦设置
   * @param {Number} roomId 房间号
   */
  async getVoiceJoinConfig (roomId) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId
    }
    return (await this.mobileAxios.get('/av/v1/VoiceJoinAnchor/getConfig', {
      params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
    })).data
  }

  /**
   * 设置语音连麦
   * @param {Number} roomId 房间号
   * @param {Number} type 限制类型
   * @param {Number} guard 舰长等级
   * @param {Number} medalStart 粉丝勋章等级
   * @param {Number[]} users 用户列表
   */
  async setVoiceJoinConfig (roomId, type, guard, medalStart, users = []) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId,
      type,
      guard,
      medal_start: medalStart,
      users: users.concat(',')
    }
    return (await this.mobileAxios.post('/av/v1/VoiceJoinAnchor/setConfig',
      sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform))).data
  }

  /**
   * 获取语音连麦等候列表
   * @param {Number} roomId 房间号
   */
  async getVoiceJoinWaitList (roomId) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId
    }
    return (await this.mobileAxios.get('/av/v1/VoiceJoinAnchor/Lists', {
      params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
    })).data
  }

  /**
   * 选择语音连麦用户
   * @param {Number} roomId 房间号
   * @param {Number} uid UID
   */
  async pickUser (roomId, uid) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId,
      uid
    }
    return (await this.mobileAxios.get('/av/v1/VoiceJoinAnchor/PickUser', {
      params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
    })).data
  }

  /**
   * 拒绝或并封禁用户
   * @param {*} roomId 房间号
   * @param {*} uid UID
   * @param {1|2} type 类型type=2 只拒绝， type=1 拒绝并封禁24小时，期间无法连麦
   * @param {Number} category 未知,默认1
   */
  async rejectVoiceJoinUser (roomId, uid, type = 2, category = 1) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId,
      uid,
      type,
      category
    }
    return (await this.mobileAxios.get('/av/v1/VoiceJoinAnchor/Reject', {
      params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
    }))
  }

  /**
   * 搜索语音连麦用户
   * @param {Number} searchUid 搜索用户UID
   * @param {Number} AnchorUid 主播UID
   */
  async searchVoiceJoinUser (searchUid, AnchorUid) {
    const data = {
      access_key: this.accessKey,
      anchor_id: AnchorUid,
      uid: searchUid
    }
    return (await this.mobileAxios.get('/av/v1/VoiceJoinAnchor/SearchUser', {
      params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
    })).data
  }

  /**
   * 停止与观众连麦
   * @param {Number} roomId 房间号
   * @param {string} voiceChannel 连麦频道
   */
  async stopVoiceJoin (roomId, voiceChannel) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId,
      voice_channel: voiceChannel
    }
    return (await this.mobileAxios.get('/av/v1/VoiceJoinAnchor/Stop', {
      params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
    })).data
  }

  /**
   * 获取弹幕链接设置
   * @param {Number} roomId 房间号
   * @param {String} platform 平台
   * @param {String} player 播放器
   */
  async getDanmuConf (roomId, platform = 'pc', player = 'web') {
    const data = {
      room_id: roomId,
      platform: BiliBiliConsts.platform,
      player
    }
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36',
      'Origin': 'https://live.bilibili.com',
      'Referer': 'https://live.bilibili.com'
    }
    if (this.loginInfo && this.loginInfo.cookie_info) {
      headers.Cookie = this.loginInfo.cookie_info.cookies.map((e) => { return e.name_jct + '=' + e.value }).join(';')
    }
    return (await this.mobileAxios.get('/room/v1/Danmu/getConf', {
      params: new URLSearchParams(data),
      headers
    })).data
  }

  /**
   * 获取推流地址
   * @param {Number} roomId 房间号
   */
  async getRtmpStream (roomId) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId
    }
    return (await this.mobileAxios.get('/live_stream/v1/StreamList/get_stream_by_roomId', {
      params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
    })).data
  }
}

function RandomID (length) {
  const words = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let randomID = ''
  randomID += words[Math.floor(Math.random() * 61) + 1]
  for (let i = 0; i < length - 1; i++) randomID += words[Math.floor(Math.random() * 62)]
  return randomID
}
function ts () {
  return parseInt(Date.now() / 1000)
}
/**
 * 签名
 * @param {Object} data 数据
 * @param {String} appkey key
 * @param {String} secret secret
 * @param {String} BiliBiliConsts.platform 平台
 */
function sign (data, appkey, secret, platform) {
  data.appkey = appkey
  data.platform = platform
  data.ts = ts()
  const item = Object.keys(data).sort().map((key) => {
    return key + '=' + stringify(data[key])
  }).join('&')
  data.sign = crypto.createHash('md5').update(item + secret).digest('hex')
  const finalData = {}
  if (data.password) {
    data.password = decodeURIComponent(data.password)
  }
  if (data.seccode) {
    data.seccode = decodeURIComponent(data.seccode)
  }
  Object.keys(data).sort().forEach((key) => {
    finalData[key] = data[key]
  })
  return new URLSearchParams(finalData)
}
function stringify (item) {
  switch (typeof item) {
    case 'string':
      return item
    case 'function':
      throw new Error('Function?')
    case 'undefined':
      return ''
    default:
      return JSON.stringify(item)
  }
}
/**
 * RSA加密密码
 * @param {String} password 密码
 * @param {String} pubkey 公钥
 * @param {String} hash HASH
 */
function RSAPassword (password, pubkey, hash) {
  const padding = {
    key: pubkey,
    padding: crypto.constants.RSA_PKCS1_PADDING
  }
  const data = hash + password
  const encrypt = crypto.publicEncrypt(padding, Buffer.from(data)).toString('base64')
  return encodeURIComponent(encrypt)
}

export default new API()
