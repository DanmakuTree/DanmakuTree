<template>
  <div id="app">
    <div id="container">
      <d-header/>
      <div class="content">

      </div>
    </div>
  </div>
</template>

<script>
  import dHeader from './components/header'

  export default {
    name: 'App',
    components: {
      'd-header': dHeader
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
