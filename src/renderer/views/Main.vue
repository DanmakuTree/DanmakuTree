<template>
  <div id="container">
    <header>
      <div style="margin-right: 8px">
        <span class="icon iconfont iconic_Library" style="font-size: 22px;color: #0062ff"></span>
      </div>
      <span>
        弹幕树
      </span>
    </header>
    <div class="content">
      <nav-menu/>

      <div style="flex: 1;overflow: scroll;display: flex">
        <div id="float-bar">
          <div style="width: 32px;height: 32px;background: black;border-radius: 8px;margin-right: 16px"></div>
          <div style="width: 32px;height: 32px;background: black;border-radius: 8px;margin-right: 16px"></div>
          <div style="width: 32px;height: 32px;background: black;border-radius: 8px;margin-right: 16px"></div>
          <div style="width: 32px;height: 32px;background: black;border-radius: 8px;margin-right: 16px"></div>
          <div style="width: 32px;height: 32px;border-radius: 8px;margin-right: 16px;border: 1px dashed #E2E2EA">
          </div>
          <div style="flex:1"></div>
<!--          <my-input />-->
        </div>
        <Transition mode="out-in" name="list">
          <router-view />
        </Transition>
      </div>

    </div>
  </div>
</template>

<script>
  import NavMenu from '../components/NavMenu/NavMenu'
  import input from '../components/form/input'
  export default {
    name: 'Main',
    components: {
      'nav-menu': NavMenu,
      'my-input': input
    },
    computed: {
      routerTitle () {
        return this.$route.meta.title
      }
    }
  }
</script>

<style scoped>
  #container {
    display: flex;
    width: 100vw;
    flex-direction: column;
    height: 100vh;
  }
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
    backdrop-filter: blur(20px);
    border-bottom: 1px solid #e2e2ea;
    overflow: hidden;
    padding:0 20px;
  }
  #float-bar{
    display: flex;
    align-items: center;
    position: absolute;
    padding: 0 20px;
    z-index: 9;
    border-top:1px solid #e2e2ea;
    box-sizing: border-box;
    /*backdrop-filter: blur(20px);*/
    background: rgba(255,255,255,1);
    width: 760px;
    height: 60px;
    bottom: 0;
  }
  .content {
    flex: 1;
    overflow: hidden;
    display: flex;
  }
</style>
