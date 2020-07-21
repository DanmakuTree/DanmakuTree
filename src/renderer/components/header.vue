<template>
  <header>
    <span class="icon iconfont iconic_Library" style="font-size: 22px;color: #0062ff;margin-right: 8px"></span>
    <span style="font-weight: normal">
      弹幕树
    </span>
    <span style="flex: 1"/>
    <span class="icon iconfont iconic_Minus window-icon" @click="minimize" />
    <span class="icon iconfont iconic_Closs1 window-icon" @click="close" />
  </header>
</template>

<script>
  export default {
    name: 'dHeader',
    methods: {
      minimize () {
        this.$currentWindow.minimize()
      },
      close () {
        this.$currentWindow.close()
      }
    }

  }
</script>

<style scoped>
  header{
    -webkit-app-region: drag;
    height: 48px;
    display: flex;
    font-family: PingFangSC,sans-serif;
    font-weight: 500;
    font-size: 16px;
    color: #44444F;
    align-items: center;
    background: rgba(123,255,255,0);
    background-color: white;
    backdrop-filter: blur(20px);
    border-bottom: 1px solid #e2e2ea;
    overflow: hidden;
    padding:0 12px 0 20px;
  }
  .window-icon{
    padding: 8px;
    -webkit-app-region: no-drag;
  }
</style>
