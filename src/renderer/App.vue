<template>
  <div id="app">
    <div id="container">
      <d-header/>
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
  </div>
</template>

<script>
  import Vue from 'vue'
  import NavMenu from './components/NavMenu/NavMenu'
  import floatbar from './components/floatbar'
  import dHeader from './components/header'

  export default Vue.extend({
    name: 'App',
    components: {
      'nav-menu': NavMenu,
      'd-header': dHeader,
      'float-bar': floatbar
    },
    computed: {
      routerTitle () {
        return this.$route.meta.title
      }
    }

  })
</script>
<style scoped>
  #app{
    overflow: hidden;
  }
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
