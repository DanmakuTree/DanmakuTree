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
        <float-bar/>
        <Transition mode="out-in" name="list">
          <router-view />
        </Transition>
      </div>

    </div>
  </div>
</template>

<script>
  import NavMenu from '../components/NavMenu/NavMenu'
  import floatbar from '../components/floatbar'
  export default {
    name: 'Main',
    components: {
      'nav-menu': NavMenu,
      'float-bar': floatbar
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
  .content {
    flex: 1;
    overflow: hidden;
    display: flex;
  }
</style>
