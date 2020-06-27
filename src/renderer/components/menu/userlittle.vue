<!--显示用户头像和用户名的UI组件-->
<template>
  <div style="display: flex;align-items: center">
    <div style="width: 32px;height: 32px;border-radius: 50%;">
      <img :src="userInfo.face" width="100%" height="100%"/>
    </div>
    <div style="margin-left: 8px;display: flex;flex-direction: column;justify-content: space-between" @click="login">
      <div style="font-size: 12px;font-weight: bold;color: #171725">{{userInfo.name}}</div>
      <div style="font-size: 12px;">哔哩哔哩</div>
    </div>
  </div>
</template>

<script>
  import type from '../modal/modelTypeEnum'
  export default {
    name: 'userlittle',
    methods: {
      login () {
        this.$store.commit('showModal', type.LOGIN)
      }
    },
    computed: {
      userInfo () {
        return {
          name: this.$store.state.userInfo.uname,
          face: this.$store.state.userInfo.face
        }
      }
    }
  }
</script>

<style scoped>

</style>
