<template>
  <div class="container">
    <div class="main">
      <h1>主程序</h1>
      <div class="services">
        <h2>服务</h2>
        <div class="WebsocketService">
          <h3>WebsocketService</h3>
          <p>运行状态：{{main.services.WebsocketService.status}}</p>
          <p>运行端口：{{main.services.WebsocketService.port}}</p>
          <p>连接数：{{main.services.WebsocketService.count}}</p>
          <a-button type="primary" @click="startWebsocketService" :disabled='main.services.WebsocketService.status==="ready"'>
            启动
          </a-button>
          <a-button type="danger" @click="stopWebsocketService" :disabled='main.services.WebsocketService.status==="prepare"'>
            停止
          </a-button>
          <a-checkbox v-model="main.services.WebsocketService.startWebsocketServiceAtStart">
            随程序自动启动
          </a-checkbox>
        </div>
      </div>
    </div>
    <div class="about">
      <h1>关于</h1>
      <p>版本号： {{about.version}}</p>
      <p>Git 版本号： {{about.GitVersion}}</p>
      <p>Git Hash： {{about.GitHash}}</p>
      <p>Git 分支： {{about.GitVersion}}</p>
    </div>
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        'moduleId': '9ead739b-a95d-4673-9e40-2f18f4ad895e',
        'main': {
          'services': {
            'WebsocketService': {
              count: 0,
              port: 0,
              status: '未知',
              startWebsocketServiceAtStart: false
            }
          }
        },
        'about': {
          'version': '',
          'GitVersion': '',
          'GitHash': '',
          'GitBranch': ''
        }
      }
    },
    danmaku: {
      'Main.Services.WebsocketService.statusUpdate' () {
        this.$main.Services.WebsocketService.getStatus().then((res) => {
          this.main.services.WebsocketService.count = res.count
          this.main.services.WebsocketService.port = res.port
          this.main.services.WebsocketService.status = res.status
        }).catch(console.error)
      }
    },
    watch: {
      'main.services.WebsocketService.startWebsocketServiceAtStart' () {
        this.$main.updateConfig('startWebsocketServiceAtStart', this.main.services.WebsocketService.startWebsocketServiceAtStart)
      }
    },
    mounted () {
      this.$main.getGitVersion().then((e) => {
        this.about.GitVersion = e.version
        this.about.GitHash = e.hash
        this.about.GitBranch = e.branch
      })
      this.$main.getVersion().then((e) => {
        this.about.version = e
      })
      this.$main.Services.WebsocketService.getStatus().then((res) => {
        this.main.services.WebsocketService.count = res.count
        this.main.services.WebsocketService.port = res.port
        this.main.services.WebsocketService.status = res.status
        console.log(res)
      }).catch(console.error)
      this.$main.getConfig('startWebsocketServiceAtStart').then((res) => {
        console.log(res)
        this.main.services.WebsocketService.startWebsocketServiceAtStart = res
      }).catch(console.error)
    },
    methods: {
      startWebsocketService () {
        this.$main.Services.WebsocketService.start()
      },
      stopWebsocketService () {
        this.$main.Services.WebsocketService.stop()
      }
    }
  }
</script>
<style scoped>
.container{
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow: hidden auto;
}
</style>
