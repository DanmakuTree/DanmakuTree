<template>
  <div class="home">
    <div class="left">
      <a-input-search
        style="font-size: 18px"
        placeholder="直播间id"
        enter-button="添加房间"
      />
      <draggable v-model="roomList" handle=".handle">
        <transition-group  type="transition" name="flip-list">
          <div
            v-for="element in roomList"
            :key="element.roomId"
            class="card"
            style="margin-top: 10px">
            <a-icon type="menu" class="handle"/>
            {{element.title}}roomid:{{element.roomId}}
          </div>
        </transition-group>
      </draggable>
    </div>
    <div class="right">
      <div class="card">
        <a-button type="primary">
          登陆bilibili账号
        </a-button>
      </div>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="应用模块">
          <div class="small-card" @click="openWin">
            <span></span>
            弹幕助手
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="obs模块" force-render>
          Content of Tab Pane 2
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
  import draggable from 'vuedraggable'
  export default {
    name: 'Home',
    components: {
      draggable
    },
    data () {
      return {
        roomList: [
          {
            roomId: 0,
            title: '直播间1'
          },
          {
            roomId: 1,
            title: '直播间2'
          }
        ]
      }
    },
    methods: {
      openWin () {
        window.API.CreateWindow()
      }
    }
  }
</script>
<style>
  .home{
    display: flex;
    padding: 10px;
    flex: 1;
  }
  .card{
    height: 128px;
    border-radius: 4px;
    background-color: white;
    border: 1px solid #dddee1;
    padding: 10px;
  }
  .left{
    width: 280px;
  }
  .right{
    flex: 1;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
  }
  .small-card{
    display: flex;
    height: 50px;
    width: 190px;
    background-color: white;
    align-items: center;
    border: 1px solid #dddee1;
    border-radius: 4px;
    overflow: hidden;
  }
  .small-card span{
    height: 50px;
    width: 50px;
    margin-right: 10px;
    background-color: #26ade3;
  }
  .handle{
    cursor: move;
  }
</style>
