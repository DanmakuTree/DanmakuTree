<template>
  <div id="d-modal-container" v-show="modalVisible" @click="hidden">
    <component :is="component"/>
  </div>
</template>

<script>
  import loginmodal from './loginmodal'
  export default {
    name: 'd_modal',
    data () {
      return {}
    },
    watch: {
    },
    computed: {
      isLogin () {
        return this.$store.state.isLogin
      },
      modalVisible () {
        return this.$store.state.modalVisible
      },
      component () {
        return this.isLogin ? loginmodal : null
      }

    },
    methods: {
      hidden () {
        console.log('1111')
        this.$store.commit('hiddenModal')
      }
    }
  }
</script>

<style scoped>
  #d-modal-container {
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    display: flex;
    backdrop-filter: blur(20px);
  }
</style>
