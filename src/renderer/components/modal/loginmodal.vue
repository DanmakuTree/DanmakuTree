<template>
  <webview src="https://account.bilibili.com/ajax/miniLogin/minilogin" style="height: 100%;width: 100%" ref="view"/>
</template>

<script>
  import store from '../../store'

  export default {
    name: 'loginmodal',
    mounted () {
      const _this = this
      const webview = this.$refs.view
      webview.addEventListener('ipc-message', (event) => {
        if (event.channel === 'message' && event.args[0] === 'close') {
          this.$store.commit('hiddenModal')
        }
        if (event.channel === 'message' && event.args[0] === 'success') {
          webview.getWebContents().session.cookies.get({ url: 'http://www.bilibili.com' }).then(cookies => {
            var cookie = []
            cookies.forEach((e) => {
              cookie.push({ name: e.name, value: e.value })
            })
            this.$platform.BiliBili.API.setCookies(cookie)
            // 保存用户信息
            this.$platform.BiliBili.API.getUserInfoNav().then(({ data }) => {
              console.log(data)
              if (data.isLogin) {
                // 保存用户信息到vuex
                _this.$store.commit('setUserInfo', data)
                _this.$store.commit('hiddenModal')
              } else {
                // todo 异常处理
                _this.$store.commit('hiddenModal')
              }
            })
          }).catch((err) => {
            console.log(err)
          })
        }
      })
    }
  }
</script>

<style scoped>

</style>
