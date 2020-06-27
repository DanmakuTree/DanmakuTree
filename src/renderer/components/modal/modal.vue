<!--模态窗组件-->
<template>
  <div id="d-modal-container">
    <component :is="component"/>
  </div>
</template>

<script>
  import loginmodal from './loginmodal'
  import type from './modelTypeEnum'
  import initializingmodal from './initializingmodal'

  export default {
    name: 'd_modal',
    data () {
      return {}
    },
    computed: {
      isLogin () {
        return this.$store.state.isLogin
      },
      component () {
        switch (this.$store.state.modalType) {
        case type.LOGIN: {
          return loginmodal
        }
        case type.INITIALIZING:
          return initializingmodal
        default :
          return null
        }
      }

    },
    methods: {
      hidden () {
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
