<template>
  <div class="container">
    <div style="margin-bottom: 8px">
      <span class="h2">Hi {{username}},</span>
      <span v-if="isSelfRoom()" style="font-size: 13px;color: #92929D">以下是直播间的统计信息</span>
      <span v-if="!isSelfRoom()" style="font-size: 13px;color: #92929D">以下是</span>
      <span v-if="!isSelfRoom()" class="h2">{{mainRoom}}</span>
      <span v-if="!isSelfRoom()" style="font-size: 13px;color: #92929D">直播间的统计信息</span>
    </div>
    <div style="display: flex;height: 260px;justify-content: space-between">
      <div class="card-r" style="flex: 1;display: flex;flex-direction: column;padding: 18px">
        <div ref="chart" class="chart"></div>
      </div>
    </div>
    <div style="display: flex;justify-content: space-between;margin-top: 32px">
      <div class="card-little">
        <div class="h2">{{liveTime}}</div>
        <div style="font-size: 12px;color: #696974;">直播时长</div>
        <div style="margin-top: 12px;">
          {{liveStatus ? "正在直播" : "准备中"}}
        </div>

      </div>
      <div class="card-little">
        <div class="h2">{{activeUser}}</div>
        <div style="font-size: 12px;color: #696974;">互动用户</div>
        <div style="margin-top: 12px;">
          (5分钟内)
        </div>

      </div>
      <div class="card-little">
        <div class="h2">{{danmaku}}</div>
        <div style="font-size: 12px;color: #696974;">弹幕数</div>
        <div style="margin-top: 12px;">
          (1分钟内)
        </div>
      </div>
      <div class="card-little">
        <div class="h2">{{gold}} 元</div>
        <div style="font-size: 12px;color: #696974;">本场直播流水</div>
        <div style="margin-top: 12px;">
          (有记录范围内)
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Home2',
    data: function () {
      return {
        mainRoom: 0,
        interval: null,
        chart: null,
        liveId: '',
        columns: [],
        data: [],
        option: {
          backgroundColor: 'white',
          grid: {
            top: 8,
            left: 20,
            right: 20,
            bottom: 20
          },
          xAxis: {
            type: 'time',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#F1F1F5'
              }
            },
            axisLabel: {
              color: '#92929D'
            },
            axisLine: {
              show: false
            },
            boundaryGap: false,
            axisTick: {
              show: false,
              alignWithLabel: true
            }
          },
          yAxis: [],
          series: [],
          tooltip: {
            trigger: 'axis'
          },
          dataset: {
            source: [],
            dimensions: ['time']
          }
        },
        statusList: [],
        liveStatus: false,
        loaded: true,
        liveTime: '0:00',
        lastRecordTime: 0,
        startTime: 0,
        endTime: 0,
        activeUser: 0,
        danmaku: 0,
        gold: 0
      }
    },
    computed: {
      username () {
        if (this.$store.state.isLogin) {
          return this.$store.state.userInfo.uname
        }
        return '摸鱼用户'
      }
    },
    mounted () {
      // this.chart = this.$echarts.init(this.$refs.chart)
      // this.chart.setOption(option)
      var promises = []
      promises.push(this.getMainRoom().then(this.getRoomLiveList).then(this.getRoomLiveStat).then(this.createChart))
      promises.push(this.getRoomStatus())
      Promise.all(promises).then(() => {
        if (this.loaded && this.mainRoom !== 0 && this.statusList.length > 0 && this.liveId !== '') {
          this.$platform.BiliBili.API.getInfoByRoom(this.mainRoom).then((res) => {
            //
            if (!this.loaded) {
              return
            }
            if (res.data.room_info.live_status === 1) {
              this.liveStatus = true
              this.startTime = res.data.room_info.live_start_time * 1000
              if (!this.interval) {
                this.interval = setInterval(this.tick, 1000)
              }
              this.tick()
            }
          }).catch(console.error)
        }
      })
    },
    beforeDestroy () {
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
      }
      this.loaded = false
    },
    danmaku: {
      'Platform.BiliBili.Service.DanmakuService.Message' (msg) {
        if (msg.roomId === this.mainRoom) {
          if (msg.data.type === 'live' && !this.liveStatus) {
            this.liveStatus = true
            this.startTime = Date.now()
            setTimeout(() => {
              if (this.loaded) {
                this.getRoomLiveList().then(this.getRoomLiveStat).then(this.createChart).then(() => {
                  if (this.loaded && this.mainRoom !== 0 && this.statusList.length > 0 && this.liveId !== '') {
                    this.$platform.BiliBili.API.getInfoByRoom(this.mainRoom).then((res) => {
                      if (!this.loaded) {
                        return
                      }
                      if (res.data.room_info.live_status === 1) {
                        this.liveStatus = true
                        this.startTime = res.data.room_info.live_start_time * 1000
                        if (!this.interval) {
                          this.interval = setInterval(this.tick, 1000)
                        }
                        this.tick()
                      }
                    }).catch(console.error)
                  }
                })
              }
            }, 1000)
          } else if ((msg.data.type === 'cut' || msg.data.type === 'prepare') && this.liveStatus) {
            this.liveStatus = false
            this.endTime = Date.now()
            clearInterval(this.interval)
            this.interval = null
          }
        }
      }
    },
    methods: {
      isSelfRoom () {
        return this.$store.state.isLogin && parseInt(this.$store.state.userInfo.room_id) === parseInt(this.mainRoom)
      },
      getMainRoom () {
        return this.$main.getRoomList().then((list) => {
          if (list.length > 0) {
            this.mainRoom = list[0].roomId
          }
          return this.mainRoom
        })
      },
      getRoomLiveList () {
        if (this.mainRoom === 0) {
          return false
        } else {
          return this.$platform.BiliBili.Services.StatisticsService.getRoomLiveListLast(this.mainRoom, 5).then((list) => {
            if (list.length > 0) {
              this.liveId = list[0].id
              this.startTime = list[0].startTime
              this.endTime = list[0].endTime
              this.liveTime = toTimeString(Math.floor((this.endTime - this.startTime) / 1000))
              this.columns = JSON.parse(list[0].columns)
            }
          })
        }
      },
      getRoomLiveStat () {
        if (this.liveId === '') {
          return false
        } else {
          return this.$platform.BiliBili.Services.StatisticsService.getRoomLiveStatAll(this.liveId).then((list) => {
            this.option.dataset.source = list
            if (list.length > 0) {
              var last = list[list.length - 1]
              this.activeUser = last.user
              this.danmaku = last.danmu
              this.gold = last.totalGold.toFixed(2)
              this.lastRecordTime = last.time
            }
          })
        }
      },
      createChart () {
        this.chart = this.$echarts.init(this.$refs.chart, true)
        if (this.option.dataset.source.length > 0) {
          let a = 0
          this.option.dataset.dimensions = ['time']
          this.option.series = []
          this.option.yAxis = []
          this.columns.forEach((e) => {
            if (e.name.startsWith('total')) {
              this.option.dataset.dimensions.push(e.name)
              this.option.series.push({
                type: 'line',
                lineStyle: {
                  width: 3
                },
                // areaStyle: {
                //   opacity: 0.4
                // },
                smooth: true,
                encode: { x: 'time', y: e.name },
                yAxisIndex: a++,
                name: e.displayName,
                symbol: 'none'
              })
              this.option.yAxis.push({ type: 'value', axisLine: false, axisTick: false, splitLine: true })
            }
          })
          this.chart.setOption(this.option)
        }
      },
      tick () {
        if (!this.loaded) {
          clearInterval(this.interval)
          this.interval = null
          return
        }
        var liveTime = (Date.now() - this.startTime) / 1000
        this.liveTime = toTimeString(liveTime)
        if (Date.now() - this.lastRecordTime > 30000) {
          this.$platform.BiliBili.Services.StatisticsService.getRoomLiveStatLast(this.liveId, 1).then((list) => {
            if (list.length > 0) {
              this.lastRecordTime = list[0].time
              this.activeUser = list[0].user
              this.danmaku = list[0].danmu
              this.gold = list[0].totalGold.toFixed(2)
              this.option.dataset.source.push(list[0])
              this.chart.setOption(this.option)
            }
          }).catch(console.error)
        }
      },
      getRoomStatus () {
        return this.$platform.BiliBili.Services.DanmakuService.getRoomList().then((data) => {
          this.statusList = data
        }).catch(console.error)
      }
    }
  }
  function toTimeString (time) {
    var second = Math.floor(time % 60)
    var minute = Math.floor(time / 60 % 60)
    var hour = Math.floor(time / 3600 % 60)
    var day = Math.floor(time / 3600 / 24 % 60)
    if (time < 3600) {
      return `${minute}:${second < 10 ? '0' + second : second}`
    } else if (time < 86400) {
      return `${hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`
    } else {
      return `${day}:${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`
    }
  }
</script>

<style scoped>
  .container{
    padding: 16px 20px;
    background: #fafafb;
    flex: 1;
  }
  .item-d{
    word-break: break-all;
    margin-bottom: 2px;
  }
  .chart{
    flex: 1
  }
</style>
