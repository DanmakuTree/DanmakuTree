<template>
  <div class="container">
    <div style="margin-bottom: 8px">
      <span class="h2">Hi mano233,</span>
      <span style="font-family: Roboto-Regular,sans-serif;font-size: 13px;color: #92929D">nmd为什么？</span>
    </div>
    <div style="display: flex;height: 260px;justify-content: space-between">
      <div class="card-r" style="flex: 1;display: flex;flex-direction: column;padding: 18px">
        <div class="title-h4" style="margin-bottom: 10px">实时弹幕数量</div>
        <my-linecharts/>
      </div>
    </div>
    <div style="display: flex;justify-content: space-between;margin-top: 32px">
      <div class="card-little">
        <div class="h2">1,233</div>
        <div style="font-family: PingFangSC-Regular,sans-serif;font-size: 11px;color: #696974;">直播时长</div>
        <div style="margin-top: 12px;">
          +1.5%
          <span class="icon iconfont iconic_Up1" style="color: #3DD598"></span>
        </div>

      </div>
      <div class="card-little">
        <div class="h2">1,233</div>
        <div style="font-family: PingFangSC-Regular,sans-serif;font-size: 11px;color: #696974;">直播时长</div>
        <div style="margin-top: 12px;">
          +1.5%
          <span class="icon iconfont iconic_Up1" style="color: #3DD598"></span>
        </div>

      </div>
      <div class="card-little">
        <div class="h2">1,233</div>
        <div style="font-family: PingFangSC-Regular,sans-serif;font-size: 11px;color: #696974;">直播时长</div>
        <div style="margin-top: 12px;">
          +1.5%
          <span class="icon iconfont iconic_Up1" style="color: #3DD598"></span>
        </div>
      </div>
      <div class="card-little">
        <div class="h2">1,233</div>
        <div style="font-family: PingFangSC-Regular,sans-serif;font-size: 11px;color: #696974;">直播时长</div>

        <div style="margin-top: 12px;">
          +1.5%
          <span class="icon iconfont iconic_Down1" style="color: #fc5a5a"></span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import mytable from '../components/table/mytable'
  import linecharts from '../components/charts/linecharts'

  export default {
    name: 'Home2',
    components: {
      'my-linecharts': linecharts,
      'my-table': mytable
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
</style>
