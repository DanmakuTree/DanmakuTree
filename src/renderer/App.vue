<template>
  <div id="app">
    <d-modal v-show="modalVisible"/>
    <div id="container">
      <d-header/>
      <div class="content">
        <d-menu/>
        <div style="flex: 1;overflow: hidden;display: flex">
          <float-bar/>
          <Transition mode="out-in" name="list">
            <router-view style="height:492px"/>
          </Transition>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import dMenu from './components/menu/menu'
  import floatbar from './components/floatbar'
  import dHeader from './components/header'
  import dModal from './components/modal/modal'

  export default {
    name: 'App',
    components: {
      'd-menu': dMenu,
      'd-header': dHeader,
      'float-bar': floatbar,
      'd-modal': dModal
    },
    computed: {
      modalVisible () {
        return this.$store.state.modalVisible
      },
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
