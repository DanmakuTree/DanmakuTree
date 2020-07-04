<template>
  <div style="flex: 1;padding: 16px 20px 80px 20px;overflow-y: scroll;background: #fafafb">
    <div style="margin-bottom: 8px">
      <span class="h2">房间列表</span>
      <a-input
        v-model="roomInput"
        placeholder="输入房间号添加..."
        class="d-input"
        style="width: 180px;height:30px;float: right"
        @pressEnter="addRoom"/>
    </div>
    <div class="card RoomInfo">
      <div class="cover" :style="cover"></div>
      <div class="info">
        <p class="title">{{roomInfo.title}}</p>
        <p>主播: {{roomInfo.username}} </p>
        <p>分区：{{roomInfo.area.big}} · {{roomInfo.area.small}}</p>
        <p><span>UID: {{roomInfo.uid}}</span> <span>直播间号: {{roomInfo.roomId}}</span> <span v-if='roomInfo.shortId !== 0'>短位号: {{roomInfo.shortId}}</span></p>
        <p>UP.{{roomInfo.upLevel.level}}  <a-progress :percent="roomInfo.upLevel.percent" :showInfo="false" style="margin:0 5px;width:100px; transform: translate(0px, -2px);"/> {{roomInfo.upLevel.percent.toFixed(2)}} %</p>
      </div>
    </div>
    <div class="card RoomList">
      <a-table :data-source="roomList" :pagination="false" :rowKey="(record)=>{return record.platform+'-'+record.roomId}" >
        <a-table-column key="platform" title="平台" data-index="platform" />
        <a-table-column key="roomId" title="房间号" data-index="roomId" />
        <a-table-column key="userId" title="UID" data-index="userId" />
        <a-table-column key="status" title="链接状态">
          <template slot-scope="text,record">
            <a-tag v-if="status(record.roomId)==='unconnect'">未连接</a-tag>
            <a-tag color="green" v-else-if="status(record.roomId)==='connected'">已连接</a-tag>
            <a-tag color="yellow" v-else-if="status(record.roomId)==='waitConfig'">等待配置</a-tag>
            <a-tag color="yellow" v-else-if="status(record.roomId)==='authing'">等待验证</a-tag>
            <a-tag color="yellow" v-else-if="status(record.roomId)==='connecting'">等待验证</a-tag>
            <a-tag color="red" v-else-if="status(record.roomId)==='closed'">连接已断开</a-tag>
            <a-tag color="red" v-else>未知</a-tag>
          </template>
        </a-table-column>
        <a-table-column key="action" title="操作">
          <template slot-scope="text,record,index">
            <a-button size='small' :disabled="index===0" @click="setMainRoom(record,index)">设置为主房间</a-button>
            <a-button size='small' v-if="status(record.roomId)==='unconnect'" @click="connect(record)">连接弹幕</a-button>
            <a-button size='small' v-if="status(record.roomId)!=='unconnect'" @click="disconnect(record)">断开连接</a-button>
            <a-button size='small' v-if="status(record.roomId)!=='unconnect'" @click="forceReconnect(record)">强制重连</a-button>
          </template>
        </a-table-column>
      </a-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'd_roomlist',
    data: function () {
      return {
        roomInfo: {
          title: '',
          username: '',
          cover: '',
          uid: 0,
          roomId: 0,
          shortId: 0,
          upLevel: {
            level: 0,
            percent: 0
          },
          area: {
            big: '',
            small: ''
          }
        },
        roomList: [],
        statusList: [],
        roomInput: ''
      }
    },
    computed: {
      cover () {
        return {
          'background-image': `url(${this.roomInfo.cover})`
        }
      }
    },
    mounted () {
      this.$main.getRoomList().then((e) => {
        this.roomList = e
        if (e.length >= 1) {
          this.displayRoomInfo(e[0].roomId)
        }
      }).catch(console.error)
      this.$platform.BiliBili.Services.DanmakuService.getRoomList().then((e) => {
        this.statusList = e
      }).catch(console.error)
    },
    danmaku: {
      'Platform.BiliBili.Service.DanmakuService.control.statusUpdate' () {
        this.$platform.BiliBili.Services.DanmakuService.getRoomList().then((e) => {
          this.statusList = e
        }).catch(console.error)
      },
      'Main.roomListUpdate' () {
        this.$main.getRoomList().then((e) => {
          this.roomList = e
        }).catch(console.error)
      }
    },
    methods: {
      status (roomId) {
        var roomStatus = this.statusList.find((e) => { return e.roomId === roomId })
        if (roomStatus) {
          return roomStatus.status
        }
        return 'unconnect'
      },
      displayRoomInfo (roomId) {
        this.$platform.BiliBili.API.getInfoByRoom(roomId).then((e) => {
          if (e.code === 0) {
            const data = e.data
            this.roomInfo.title = data.room_info.title
            this.roomInfo.cover = data.room_info.cover
            this.roomInfo.roomId = data.room_info.room_id
            this.roomInfo.shortId = data.room_info.short_id
            this.roomInfo.uid = data.room_info.uid
            this.roomInfo.username = data.anchor_info.base_info.uname
            this.roomInfo.upLevel.level = data.anchor_info.live_info.level
            this.roomInfo.upLevel.percent = (data.anchor_info.live_info.next[0] - data.anchor_info.live_info.upgrade_score) / data.anchor_info.live_info.next[0] * 100
            this.roomInfo.area.big = data.room_info.parent_area_name
            this.roomInfo.area.small = data.room_info.area_name
          }
        }).catch(console.error)
      },
      addRoom () {
        var input = this.roomInput
        this.roomInput = ''
        this.$platform.BiliBili.API.getInfoByRoom(input).then((res) => {
          if (res.code === 0) {
            this.roomList.push({
              platform: 'BiliBili',
              roomId: res.data.room_info.room_id,
              shortId: res.data.room_info.short_id,
              userId: res.data.room_info.uid
            })
            this.$main.updateRoomList(this.roomList).then(() => {}).catch(console.error)
          } else {
            this.$message.error(res.msg || '未知错误')
          }
        })
      },
      setMainRoom (record, index) {
        if (index < 1) {
          this.$message.error('??????' + index)
          return
        }
        this.roomList.splice(index, 1)
        this.roomList.unshift(record)
        this.$main.updateRoomList(this.roomList).then(() => {}).catch(console.error)
        this.displayRoomInfo(this.roomList[0])
      },
      connect (record) {
        this.$platform.BiliBili.Services.DanmakuService.connect(record.roomId).then(() => {}).catch(console.error)
      },
      disconnect (record) {
        this.$platform.BiliBili.Services.DanmakuService.disconnect(record.roomId).then(() => {}).catch(console.error)
      },
      forceReconnect (record) {
        this.$platform.BiliBili.Services.DanmakuService.forceReconnect(record.roomId).then(() => {}).catch(console.error)
      }
    }
  }
</script>

<style scoped>
.card {
  margin: 10px 0;
  padding: 16px;
  background: white;
  border-radius: 16px;
}
.RoomInfo {
  display: flex;
}
.RoomInfo > .cover {
  width: 192px;
  height: 115px;
  background-size: cover;
  border-radius: 5px;
  flex-shrink: 0;
  flex-grow: 0;
}
.RoomInfo > .info {
  padding-left: 10px;
  font-size: 12px;
}
.RoomInfo > .info > p {
  margin: 0;
}
.RoomInfo > .info > .title {
  font-size: 14px;
  font-weight: bold;
}
.RoomInfo > .action {
  float: right;
}
</style>
