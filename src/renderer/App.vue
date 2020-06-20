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
  .content {
    flex: 1;
    overflow: hidden;
    display: flex;
  }
</style>
