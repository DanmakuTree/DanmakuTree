<template>
  <div id="app">
    <d-modal />
    <div id="container">
      <d-header/>
      <div class="content">
        <d-menu/>
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
  import dMenu from './components/menu'
  import floatbar from './components/floatbar'
  import dHeader from './components/header'
  import dModal from './components/modal'

  export default {
    name: 'App',
    components: {
      'd-menu': dMenu,
      'd-header': dHeader,
      'float-bar': floatbar,
      'd-modal': dModal
    },
    created () {
      window.API.Module.getAllModuleList().then(e => { console.log(e[0].id) })
      console.log(window.API.Module.getAvailable().then(e => console.log(e)))
    },
    computed: {
      routerTitle () {
        return this.$route.meta.title
      }
    }
  }
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
  .content {
    flex: 1;
    overflow: hidden;
    display: flex;
  }
</style>
