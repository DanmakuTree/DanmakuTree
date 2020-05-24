module.exports = {
  version: '0.0.1',
  API: require('./API').API,
  Services: {
    DanmakuService: require('./Services/DanmakuService'),
    FollowerService: require('./Services/FollowerService'),
    AvaterCollectService: require('./Services/AvaterCollectService')
  }
}
