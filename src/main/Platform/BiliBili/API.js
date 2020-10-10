import axios from 'axios'
import crypto from 'crypto'
import https from 'https'
import { isDev } from '../../Consts'
import BiliBiliConsts from './Consts'
import { WebInterfaceBase } from '../../WebInterfaceBase'
import { KVTable } from '../../KVTable'
import { session } from '../../ElectronMock'
// import { promises as fspromise } from 'fs'
// const readFile = fspromise.readFile
// const writeFile = fspromise.writeFile
export class API extends WebInterfaceBase {
  constructor () {
    super()
    this.version = '0.9.2'
    this.accessKey = ''
    this.uid = 0
    this.bili_jct = ''
    this.cookies = null
    this.mobileAxios = createMobileAxios()
    this.webAxios = createWebAxios()
    /**
     * @type {'NONE'|'WEB'|'MOBILE'}
     */
    this.loginType = 'NONE' // "WEB" "MOBILE"
    const methodList = [
      'logout', 'getLoginKey', 'setCookies', 'mobilelogin', 'getUserLiveInfo', 'getUserLiveInfo1', 'saveLoginInfo',
      'getAreaList', 'getMyChooseArea', 'getCoverList', 'setCover', 'getTitleList', 'getMyInfo', 'getReleation',
      'getLiverCustomTags', 'setLiverCustomTags', 'updateRoomInfo', 'getUserInfoNav', 'getFollowingList', 'getFollowersList',
      'setRoomTitle', 'setRoomArea', 'startLive', 'stopLive', 'getUserCard', 'getUserLiveCard', 'getInfoByRoom', 'getRoomInfoByUid',
      'getDanmuConf', 'getRtmpStream', 'getInfoByUser', 'getRoomGiftList', 'getGiftConfig', 'getWebServerRank',
      'getWebGuardRank', 'getWebMedalRank', 'getRoomInfo', 'getRoomAdminByRoom', 'getRoomAdminByAnchor', 'sendRoomMessage', 'blockRoomUser',
      'removeRoomBlockUserByUid', 'getRoomAdminByUid', 'getBlockUserListBySearch', 'addRoomAdmin', 'removeRoomAdmin',
      'getDanmuReportReasonList', 'reportDanmaku', 'getSuperChatReportReasonList', 'reportSuperChatMessage', 'removeSuperChatMessage', 'setDanmuColor',
      'setDanmuMode', 'updateDanmuConf', 'getRoomNews', 'updateRoomNews', 'getDanmuConfig', 'getSuperChatConfig', 'getSuperChatMessageInfo']
    methodList.forEach((e) => {
      this[e] = this[e].bind(this)
      this.available.push(e)
    })
    // readFile('./login.json', { encoding: 'utf-8' }).then((e) => {
    //   e = JSON.parse(e)
    //   this.accessKey = e.accessKey
    //   this.uid = e.uid
    //   this.bili_jct = e.bili_jct
    //   this.cookies = e.cookies
    //   this.loginType = e.loginType
    //   this.webAxios = createWebAxios(this.cookies)
    // }).catch((e) => { console.log(e) })
  }

  init (db) {
    this.store = new KVTable(db, 'auth')
    var type = this.store.get('loginType')
    if (typeof type === 'string' && (type = JSON.parse(type)) && (type === 'WEB' || type === 'MOBILE')) {
      this.loginType = type
      this.accessKey = JSON.parse(this.store.get('accessKey'))
      this.uid = JSON.parse(this.store.get('uid'))
      this.bili_jct = JSON.parse(this.store.get('bili_jct'))
      this.cookies = JSON.parse(this.store.get('cookies'))
      this.webAxios = createWebAxios(this.cookies)
    }
  }

  /**
   * 获取加密密钥
   */
  async getLoginKey () {
    const data = {}
    return (await this.mobileAxios.post('https://passport.bilibili.com/api/oauth2/getKey',
      sign(data, BiliBiliConsts.loginAppKey, BiliBiliConsts.loginSecretkey, BiliBiliConsts.platform))).data
  }

  /**
   * 移动设备登录
   * @param {String} username 用户名(手机号、邮箱)
   * @param {String} password 密码
   * @param {String} pubkey pubkey
   * @param {String} hash hash
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
      this.accessKey = loginRes.data.token_info.access_token
      this.cookies = loginRes.data.cookie_info.cookies.map((e) => { return e.name + '=' + e.value }).join(';')
      this.bili_jct = loginRes.data.cookie_info.cookies.find((v) => { return v.name === 'bili_jct' }).value
      this.uid = loginRes.data.token_info.mid
      this.cookies.forEach((e) => {
        e.name = e.name_jct
      })
      this.webAxios = createWebAxios(this.cookies)
      this.loginType = 'MOBILE'
      loginRes.data = {}
    }
    this.saveLoginInfo()
    return loginRes
  }

  /**
   * 设置cookies
   * @param {String} cookies cookies
   */
  async setCookies (cookies) {
    this.cookies = cookies.map((e) => { return e.name + '=' + e.value }).join(';')
    this.uid = cookies.find((v) => { return v.name === 'DedeUserID' }).value
    this.bili_jct = cookies.find((v) => { return v.name === 'bili_jct' }).value
    this.webAxios = createWebAxios(this.cookies)
    this.loginType = 'WEB'
    this.saveLoginInfo()
    return true
  }

  async logout () {
    this.webAxios.get('https://account.bilibili.com/login?act=exit').then(() => {}).catch(() => {})
    this.loginType = 'NONE'
    this.accessKey = ''
    this.uid = 0
    this.bili_jct = ''
    this.cookies = null
    this.mobileAxios = createMobileAxios()
    this.webAxios = createWebAxios()
    this.saveLoginInfo()
    var bilibiliDomain = ['https://api.bilibili.com', 'https://live.bilibili.com', 'https://passport.biligame.com', 'https://passport.bigfun.cn', 'https://passport.bigfunapp.cn', 'https://www.biliapi.com']
    bilibiliDomain.forEach((e) => {
      session.defaultSession.clearStorageData({
        origin: e
      })
    })
  }

  /**
   * 获取自己直播信息
   * app端口 Web兼容
   */
  async getUserLiveInfo () {
    if (this.loginType === 'NONE') {
      return { code: -101, message: '账号未登录', ttl: 1 }
    }
    if (this.loginType === 'MOBILE') {
      const data = {
        access_key: this.accessKey,
        uId: this.uid
      }
      return (await this.mobileAxios.get('/xlive/app-blink/v1/room/GetInfo', {
        params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
      })).data
    } else {
      return (await this.webAxios.get('/xlive/app-blink/v1/room/GetInfo', {
        params: {
          platform: 'pc'
        }
      })).data
    }
  }

  /**
   * 获取自己直播信息(User Only)
   * web接口
   */
  async getUserLiveInfo1 () {
    return (await this.webAxios.get('/xlive/web-ucenter/user/get_user_info')).data
  }

  /**
   * 获取自己用户信息
   * web接口，主站接口
   */
  async getUserInfoNav () {
    return (await this.webAxios.get('https://api.bilibili.com/x/web-interface/nav', {
      headers: {
        'Origin': 'https://www.bilibili.com',
        'Referer': 'https://www.bilibili.com'
      }
    })).data
  }

  /**
   * 获取自己用户信息
   * web接口，主站接口
   */
  async getMyInfo () {
    return (await this.webAxios.get('https://api.bilibili.com/x/space/myinfo', {
      headers: {
        'Origin': 'https://space.bilibili.com',
        'Referer': 'https://space.bilibili.com'
      }
    })).data
  }

  /**
   * 获取双方关系
   * @param {Number} userId 对方uid
   */
  async getReleation (userId) {
    return (await this.webAxios.get('https://api.bilibili.com/x/space/acc/relation', {
      headers: {
        'Origin': 'https://space.bilibili.com',
        'Referer': 'https://space.bilibili.com/' + userId
      },
      params: {
        mid: userId
      }
    })).data
  }

  /**
   * 拉取关注列表
   * @param {Number} userId 用户UID
   * @param {Number} pageNumber 页数
   * @param {Number} pageSize 单页数量
   * @param {String} order 顺序
   */
  async getFollowingList (userId, pageNumber = 1, pageSize = 20, order = 'desc') {
    return (await this.webAxios.get('https://api.bilibili.com/x/relation/followings', {
      headers: {
        'Origin': 'https://space.bilibili.com',
        'Referer': 'https://space.bilibili.com/' + userId
      },
      params: {
        vmid: userId,
        pn: pageNumber,
        ps: pageSize,
        order: order
      }
    })).data
  }

  /**
   * 拉取粉丝列表
   * @param {Number} userId 用户UID
   * @param {Number} pageNumber 页数
   * @param {Number} pageSize 单页数量
   * @param {String} order 顺序
   */
  async getFollowersList (userId, pageNumber = 1, pageSize = 20, order = 'desc') {
    return (await this.webAxios.get('https://api.bilibili.com/x/relation/followers', {
      headers: {
        'Origin': 'https://space.bilibili.com',
        'Referer': 'https://space.bilibili.com/' + userId
      },
      params: {
        vmid: userId,
        pn: pageNumber,
        ps: pageSize,
        order: order
      }
    })).data
  }

  /**
   * 拉取用户卡片
   * @param {Number} userId UID
   * @param {Number} photo 是否拉取头图
   */
  async getUserCard (userId, photo = 1) {
    return (await this.webAxios.get('https://api.bilibili.com/x/web-interface/card', {
      headers: {
        'Origin': 'https://t.bilibili.com',
        'Referer': 'https://t.bilibili.com/'
      },
      params: {
        mid: userId,
        photo
      }
    })).data
  }

  /**
   * 获取用户直播卡片
   * app接口,web用
   * @param {Number} uid 对方uid
   * @param {Number} anchorUid 主播uid
   */
  async getUserLiveCard (uid, anchorUid = this.uid) {
    return (await this.webAxios.get('/xlive/app-room/v1/card/card_user', {
      params: {
        ruid: anchorUid,
        uid
      }
    })).data
  }

  /**
   * 获取头衔列表
   * web接口
   */
  async getTitleList () {
    return (await this.webAxios.get('/rc/v1/Title/webTitles')).data
  }

  /**
   * 拉取房间信息
   * web接口
   * @param {Number} roomId 房间号
   */
  async getRoomInfo (roomId) {
    return (await this.webAxios.get('/room/v1/Room/get_info', {
      params: {
        'room_id': roomId
      }
    })).data
  }

  /**
   * 根据房间号获取信息(大杂烩)
   * web接口
   * @param {Number} roomId 房间号
   */
  async getInfoByRoom (roomId) {
    return (await this.webAxios.get('/xlive/web-room/v1/index/getInfoByRoom', {
      params: {
        'room_id': roomId
      }
    })).data
  }

  /**
   * 获取用户在房间的信息(大杂烩)
   * web接口
   * @param {Number} roomId 房间号
   */
  async getInfoByUser (roomId) {
    return (await this.webAxios.get('/xlive/web-room/v1/index/getInfoByUser', {
      params: {
        'room_id': roomId
      }
    })).data
  }

  /**
   * 获取房间礼物列表(能送出)
   * @param {Number} roomId 房间号
   * @param {Number} areaId 分区号
   * @param {Number} areaParentId 大分区号
   * @param {String} platform 平台
   */
  async getRoomGiftList (roomId, areaId, areaParentId, platform = 'pc') {
    return (await this.webAxios.get('/gift/v3/live/room_gift_list', {
      params: {
        'roomid': roomId,
        'area_v2_id': areaId,
        'area_v2_parent_id': areaParentId,
        platform
      }
    })).data
  }

  /**
   * 获取礼物设置
   * @param {Number} roomId 房间号（目前没啥用）
   * @param {String} platform 平台
   */
  async getGiftConfig (roomId = 1, platform = 'pc') {
    return (await this.webAxios.get('/gift/v4/Live/giftConfig', {
      params: {
        roomid: roomId,
        platform
      }
    })).data
  }

  /**
   * 拉取房间信息
   * web接口
   * @param {Number} roomId 房间号
   */
  async getRoomInfoByUid (userId) {
    return (await this.webAxios.get('/room/v1/Room/getRoomInfoOld', {
      headers: {
        'Origin': 'https://space.bilibili.com',
        'Referer': 'https://space.bilibili.com/' + userId
      },
      params: {
        mid: userId
      }
    })).data
  }

  /**
   * 拉取网页七日榜
   * @param {Number} roomid 房间号
   * @param {Number} anchorUid 主播UID
   */
  async getWebServerRank (roomid, anchorUid) {
    return (await this.webAxios.get('/rankdb/v1/RoomRank/webSevenRank', {
      params: {
        roomid: roomid,
        ruid: anchorUid
      }
    })).data
  }

  /**
   * 拉取舰队列表
   * @param {Number} roomId 房间号
   * @param {Number} anchorUid 主播uid
   * @param {Number} page 页数
   * @param {Numbe} page_size 页数
   */
  async getWebGuardRank (roomId, anchorUid, page = 1, page_size = 29) {
    return (await this.webAxios.get('/xlive/app-room/v1/guardTab/topList', {
      params: {
        roomid: roomId,
        ruid: anchorUid,
        page,
        page_size
      }
    })).data
  }

  /**
   * 拉取粉丝榜
   * @param {Number} roomId 房间号
   * @param {Number} anchorUid 主播UID
   */
  async getWebMedalRank (roomId, anchorUid) {
    return (await this.webAxios.get('/rankdb/v1/RoomRank/webMedalRank', {
      params: {
        roomid: roomId,
        ruid: anchorUid
      }
    })).data
  }

  /**
   * 拉取分区列表
   * 双端接口
   * @param {Number} showPinyin 显示拼音(app未测支持情况)
   */
  async getAreaList (showPinyin = 1) {
    if (this.loginType === 'MOBILE') {
      const data = {
        access_key: this.accessKey
      }
      return (await this.mobileAxios.get('/room/v1/Area/getList', {
        params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
      })).data
    } else {
      return (await this.webAxios.get('/room/v1/Area/getList', {
        params: {
          'show_pinyin': showPinyin
        }
      })).data
    }
  }

  /**
   * 获取最近三个分区
   * 双端接口
   * @param {Number} roomId 房间号
   */
  async getMyChooseArea (roomId) {
    if (this.loginType === 'MOBILE') {
      const data = {
        access_key: this.accessKey,
        roomid: roomId
      }
      return (await this.mobileAxios.get('/room/v1/Area/getMyChooseArea', {
        params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
      })).data
    } else {
      return (await this.webAxios.get('/room/v1/Area/getMyChooseArea', { params: { roomid: roomId } })).data
    }
  }

  /**
   * 拉取封面列表
   * 双端接口
   * @param {Number} roomId 房间号
   * @param {String}
   */
  async getCoverList (roomId, type = 'all_cover') {
    if (this.loginType === 'MOBILE') {
      const data = {
        'access_key': this.accessKey,
        'room_id': roomId
      }
      return (await this.mobileAxios.get('/room/v1/Cover/get_list', {
        params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
      })).data
    } else {
      return (await this.webAxios.get('/room/v1/Cover/get_list', {
        params: {
          'room_id': roomId,
          'type': type
        }
      })).data
    }
  }

  /**
   * 设置封面
   * @param {Number} roomId 房间号
   * @param {Number} picId 封面图片id
   */
  async setCover (roomId, picId) {
    const data = {
      room_id: roomId,
      pic_id: picId
    }
    if (this.loginType === 'MOBILE') {
      data.access_key = this.accessKey
      return (await this.mobileAxios.post('/room/v1/Cover/update',
        sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform))).data
    } else {
      data.csrf_token = this.bili_jct
      return (await this.webAxios.post('/room/v1/Cover/update', new URLSearchParams(data))).data
    }
  }

  /**
   * 拉取分区自定义Tag
   * @param {Number} areaId 分区ID
   * @param {Number} parentAreaId 大分区ID
   */
  async getLiverCustomTags (areaId, parentAreaId) {
    const data = {
      area_id: areaId,
      parent_area_id: parentAreaId
    }
    if (this.loginType === 'MOBILE') {
      data.access_key = this.accessKey
      return (await this.mobileAxios.get('/room/v3/Area/getLiverCustomTags', {
        params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
      })).data
    } else {
      return (await this.webAxios.get('/room/v3/Area/getLiverCustomTags', {
        params: data
      })).data
    }
  }

  /**
   * 设置房间分区自定义标签 开播之后调用
   * app端接口 web端有效
   * @param {Number} roomId 房间号
   * @param {Number} tagId tagId
   */
  async setLiverCustomTags (roomId, tagId) {
    const data = {
      room_id: roomId,
      tag_id: tagId
    }
    if (this.loginType === 'MOBILE') {
      data.access_key = this.accessKey
      return (await this.mobileAxios.get('/room/v3/Area/setLiverCustomTag', {
        params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
      })).data
    } else {
      data.csrf_token = this.bili_jct
      return (await this.webAxios.post('/room/v3/Area/setLiverCustomTag', new URLSearchParams(data))).data
    }
  }

  /**
   * 更新房间信息
   * 双端接口
   * @param {object} data 数据
   */
  async updateRoomInfo (data) {
    if (this.loginType === 'MOBILE') {
      data.access_key = this.accessKey
      return (await this.mobileAxios.post('/room/v1/Room/update', sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
      )).data
    } else {
      data.csrf_token = this.bili_jct
      return (await this.webAxios.post('/room/v1/Room/update', new URLSearchParams(data))).data
    }
  }

  /**
   * 设置房间标题
   * based on updateRoomInfo
   * @param {Number} roomId 房间号
   * @param {String} title 房间标题
   */
  async setRoomTitle (roomId, title) {
    return this.updateRoomInfo({
      room_id: roomId,
      title
    })
  }

  /**
   * 设置房间分区
   * based on updateRoomInfo
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
      area_v2: areaId,
      room_id: roomId,
      type
    }
    if (this.loginType === 'MOBILE') {
      data.access_key = this.accessKey
      this.build = 4700011
      return (await this.mobileAxios.post('/room/v1/Room/startLive', sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform))).data
    } else {
      data.platform = 'pc'
      data.csrf_token = this.bili_jct
      return (await this.webAxios.post('/room/v1/Room/startLive', new URLSearchParams(data))).data
    }
  }

  /**
   * 停止直播
   * @param {Number} roomId 房间号
   */
  async stopLive (roomId) {
    const data = {
      room_id: roomId
    }
    if (this.loginType === 'MOBILE') {
      data.access_key = this.accessKey
      return (await this.mobileAxios.post('/room/v1/Room/stopLive', sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform))).data
    } else {
      data.csrf_token = this.bili_jct
      return (await this.webAxios.post('/room/v1/Room/stopLive', new URLSearchParams(data))).data
    }
  }

  /**
   * 获取弹幕链接设置
   * web接口，支持app，但应用困难
   * @param {Number} roomId 房间号
   * @param {String} platform 平台
   * @param {String} player 播放器
   */
  async getDanmuConf (roomId, platform = 'pc', player = 'web') {
    const data = {
      room_id: roomId,
      platform: platform,
      player
    }
    return (await this.webAxios.get('/room/v1/Danmu/getConf', {
      params: new URLSearchParams(data)
    })).data
  }

  /**
   * 获取推流地址
   * @param {Number} roomId 房间号
   */
  async getRtmpStream (roomId) {
    const data = {
      room_id: roomId
    }
    if (this.loginType === 'MOBILE') {
      data.access_key = this.accessKey
      return (await this.mobileAxios.get('/live_stream/v1/StreamList/get_stream_by_roomId', {
        params: sign(data, BiliBiliConsts.appkey, BiliBiliConsts.secret, BiliBiliConsts.platform)
      })).data
    } else {
      return (await this.webAxios.get('/live_stream/v1/StreamList/get_stream_by_roomId', {
        params: data
      })).data
    }
  }

  /**
   * 通过房间拉取房管列表
   * @param {Number} roomId 房间号
   * @param {Number} page 页码
   * @param {Number} pageSize 单页大小
   */
  async getRoomAdminByRoom (roomId, page = 1, pageSize = 100) {
    return (await this.webAxios.get('/xlive/web-room/v1/roomAdmin/get_by_room', {
      params: {
        roomid: roomId,
        page,
        pageSize
      }
    })).data
  }

  /**
   * 通过主播Uid拉取房管列表
   * @param {Number} roomId 房间号
   * @param {Number} page 页码
   */
  async getRoomAdminByAnchor (anchorId, page = 1) {
    return (await this.webAxios.get('/live_user/v1/RoomAdmin/get_by_anchor', {
      params: {
        anchor_id: anchorId,
        page: page
      }
    })).data
  }

  /**
   * 发送弹幕
   * @param {Number} roomId 房间号
   * @param {String} msg 弹幕
   * @param {Number} color 颜色（疑似无效
   * @param {Number} mode 模式（疑似无效
   */
  async sendRoomMessage (roomId, msg = '', color = 0xffffff, mode = 1) {
    return (await this.webAxios.post('https://api.live.bilibili.com/msg/send', new URLSearchParams({
      'color': Number(Number(color).toString(10)),
      'fontsize': 25,
      mode,
      msg,
      'rnd': Math.floor(new Date().getTime() / 1000),
      'roomid': roomId,
      'bubble': 0,
      'csrf_token': this.bili_jct,
      'csrf': this.bili_jct
    }))).data
  }

  /**
   * 封禁用户
   * app端接口强行web用
   * @param {Number} roomId 房间号
   * @param {Number} userId 用户UID
   * @param {Number} hour 封禁时间
   * @param {String} msg 封禁消息（app端有存
   * @param {Number} msg_time 消息发送时间（app端有存
   */
  async blockRoomUser (roomId, userId, hour = 720, msg = '', msg_time = 0) {
    return (await this.webAxios.post('/banned_service/v1/Silent/room_block_user', new URLSearchParams({
      'roomid': roomId,
      'type': 1,
      'content': userId,
      hour,
      msg,
      msg_time,
      'csrf_token': this.bili_jct
    }))).data
  }

  /**
   * 解禁用户
   * @param {Number} roomId 房间号
   * @param {Number} userId 用户UID
   */
  async removeRoomBlockUserByUid (roomId, userId) {
    return (await this.webAxios.post('/banned_service/v1/Silent/del_block_by_uid', new URLSearchParams({
      'roomid': roomId,
      'type': 1,
      'uid': userId,
      'csrf_token': this.bili_jct
    }))).data
  }

  /**
   * 拉取自己是房管的列表
   * @param {Number} page 页数
   */
  async getRoomAdminByUid (page = 1) {
    return (await this.webAxios.get('/xlive/app-ucenter/v1/roomAdmin/get_by_uid', {
      params: {
        page
      }
    })).data
  }

  /**
   * 拉取禁言名单，支持搜索
   * app
   * @param {Number} roomid
   * @param {Number} page
   * @param {Number} pageSize
   * @param {Number|String} search 搜索
   */
  async getBlockUserListBySearch (roomid, page = 1, pageSize = 20, search = '') {
    return (await this.webAxios.get('/banned_service/v2/Silent/get_block_list', {
      params: {
        roomid,
        page,
        page_size: pageSize,
        search
      }
    })).data
  }

  /**
   * 拉取弹幕举报理由
   */
  async getDanmuReportReasonList () {
    return (await this.webAxios.get('room_ex/v1/Danmu/forDanmuReason')).data
  }

  /**
   * 举报弹幕
   * @param {Number} roomId 房间号
   * @param {Number} userId 用户ID
   * @param {String} message 弹幕
   * @param {String} reason 理由
   * @param {String} ts 校验数据
   * @param {String} sign 校验数据
   */
  async reportDanmaku (roomId, userId, message, reason, ts, sign) {
    return (await this.webAxios.post(('room_ex/v1/Danmu/danmuReport', new URLSearchParams({
      'roomid': roomId,
      'uid': userId,
      'msg': message,
      reason,
      ts,
      sign,
      'csrf_token': this.bili_jct,
      'csrf': this.bili_jct
    })))).data
  }

  /**
   * 拉取醒目留言举报理由
   */
  async getSuperChatReportReasonList () {
    return (await this.webAxios.get('av/v1/SuperChat/forMsgReason')).data
  }

  /**
   * 举报醒目留言
   * @param {Number} roomId
   * @param {Number} userId
   * @param {Number} messageId
   * @param {String} message
   * @param {String} reason
   * @param {String} reasonId
   * @param {String} token
   * @param {String} ts
   * @param {String} sign
   */
  async reportSuperChatMessage (roomId, userId, messageId, message, reason, reasonId, token, ts, sign = '') {
    return (await this.webAxios.post('av/v1/SuperChat/report', new URLSearchParams({
      'id': messageId,
      'roomid': roomId,
      'uid': userId,
      'msg': message,
      reason,
      'reason_id': reasonId,
      token,
      sign,
      ts,
      'csrf_token': this.bili_jct,
      'csrf': this.bili_jct
    }))).data
  }

  /**
   * 移除醒目留言
   * @param {Number} messageId 醒目留言id
   */
  async removeSuperChatMessage (messageId) {
    return (await this.webAxios.post('av/v1/SuperChat/remove', new URLSearchParams({
      'id': messageId,
      'csrf_token': this.bili_jct,
      'csrf': this.bili_jct
    }))).data
  }

  /**
   * 设置弹幕颜色
   * @param {*} color 颜色
   * @param {*} roomId 房间号
   */
  async setDanmuColor (color, roomId) {
    return this.updateDanmuConf({ color }, roomId)
  }

  /**
   * 设置
   * @param {*} mode 弹幕模式
   * @param {*} roomId 房间号
   */
  async setDanmuMode (mode, roomId) {
    return this.updateDanmuConf({ mode }, roomId)
  }

  /**
   * 更改弹幕设置
   * @param {*} conf 设置
   * @param {*} roomId 房间号
   */
  async updateDanmuConf (conf, roomId) {
    conf.roomid = roomId
    conf.csrf_token = this.bili_jct
    conf.csrf = this.bili_jct
    return (await this.webAxios.post('api/ajaxSetConfig', new URLSearchParams(conf))).data
  }

  /**
   * 任命房管
   * @param {Number} userId 新房管UID
   */
  async addRoomAdmin (userId) {
    return (await this.webAxios.post('/live_user/v1/RoomAdmin/add', new URLSearchParams({
      'admin': userId,
      'csrf_token': this.bili_jct
    }))).data
  }

  /**
   * 移除房管
   * @param {Number} userId 用户ID
   */
  async removeRoomAdmin (userId) {
    return (await this.webAxios.post('/xlive/app-ucenter/v1/roomAdmin/dismiss', new URLSearchParams({
      'uid': userId,
      'csrf': this.bili_jct
    }))).data
  }

  /**
   * 拉取房间公告
   * @param {*} roomId
   * @param {*} anchorId
   */
  async getRoomNews (roomId, anchorId) {
    return (await this.webAxios.get('room_ex/v1/RoomNews/get', {
      params: {
        roomid: roomId,
        uid: anchorId
      }
    })).data
  }

  /**
   * 更新房间公告
   * @param {*} roomId
   * @param {*} anchorId
   * @param {*} content
   */
  async updateRoomNews (roomId, anchorId, content) {
    return (await this.webAxios.post('room_ex/v1/RoomNews/update', new URLSearchParams({
      'roomid': roomId,
      'uid': anchorId,
      content,
      'csrf_token': this.bili_jct
    }))).data
  }

  /**
   * 获取当前弹幕设置
   * @param {*} roomId
   */
  async getDanmuConfig (roomId) {
    return (await this.webAxios.get('userext/v1/DanmuConf/getConfig', {
      params: {
        roomid: roomId
      }
    })).data
  }

  /**
   * 拉取直播间醒目留言配置
   * @param {*} roomId
   * @param {*} userId
   * @param {*} parentAreaId
   * @param {*} areaId
   */
  async getSuperChatConfig (roomId, userId, parentAreaId, areaId) {
    return (await this.webAxios.get('av/v1/SuperChat/config', {
      params: {
        room_id: roomId,
        ruid: userId,
        parent_area_id: parentAreaId,
        area_id: areaId
      }
    })).data
  }

  /**
   * 获取某条醒目留言设置
   * @param {*} messageId
   */
  async getSuperChatMessageInfo (messageId) {
    return (await this.webAxios.get('av/v1/SuperChat/messageInfo', {
      params: {
        id: messageId
      }
    })).data
  }

  saveLoginInfo () {
    this.store.set('accessKey', JSON.stringify(this.accessKey))
    this.store.set('cookies', JSON.stringify(this.cookies))
    this.store.set('bili_jct', JSON.stringify(this.bili_jct))
    this.store.set('uid', JSON.stringify(this.uid))
    this.store.set('loginType', JSON.stringify(this.loginType))
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

function createMobileAxios () {
  return axios.create({
    baseURL: 'https://api.live.bilibili.com',
    timeout: 5000,
    headers: {
      'User-Agent': 'Mozilla/5.0 BiliLiveDroid/2.0.0 bililive',
      'Buvid': RandomID(37)
    },
    httpsAgent: (isDev ? new https.Agent({ rejectUnauthorized: false }) : undefined)
  })
}

function createWebAxios (cookies) {
  var headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36',
    'Origin': 'https://live.bilibili.com',
    'Referer': 'https://live.bilibili.com'
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

export default new API()
