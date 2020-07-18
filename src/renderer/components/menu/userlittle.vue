<!--显示用户头像和用户名的UI组件-->
<template>
  <div v-if="isLogin" style="display: flex;align-items: center">
    <div style="width: 32px;height: 32px;border-radius: 50%;">
      <img v-if="isLogin" :src="userInfo.face" style="height: 100%;border-radius:50%;"/>
    </div>
    <div style="margin-left: 8px;display: flex;flex-direction: column;justify-content: space-between">
      <div style="font-size: 12px;font-weight: bold;color: #2177b8" @click="logout">{{userInfo.name}}</div>
      <div v-if="isLogin" style="font-size: 12px;">哔哩哔哩</div>
    </div>
  </div>
  <div v-else style="display: flex;align-items: center">
    <div style="width: 32px;height: 32px;border-radius: 50%;">
      <a-avatar style="backgroundColor:#87d068" icon="user" />
    </div>
    <div style="margin-left: 8px;display: flex;flex-direction: column;justify-content: space-between">
      <div style="font-size: 12px;font-weight: bold;color: #171725" @click="openLoginModal" >点击登录</div>
    </div>
  </div>
</template>

<script>
  import type from '../modal/modelTypeEnum'
  export default {
    name: 'userlittle',
    methods: {
      logout () {
        this.$store.dispatch('logout')
      },
      openLoginModal () {
        this.$store.commit('showModal', type.LOGIN)
      }
    },
    computed: {
      isLogin () {
        return this.$store.state.isLogin
      },
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
