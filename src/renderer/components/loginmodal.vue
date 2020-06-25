<template>
  <webview src="https://account.bilibili.com/ajax/miniLogin/minilogin" style="height: 100%;width: 100%" ref="view"/>
</template>

<script>
  export default {
    name: 'loginmodal',
    mounted () {
      const webview = this.$refs.view
      webview.addEventListener('dom-ready', () => {
        console.log(1)
        webview.insertCSS('#wrapper{pointer-events:none;}#content{pointer-events:auto;}')
      })
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
          }).catch((err) => {
            console.log(err)
          })
          this.$store.commit('hiddenModal')
        }
      })
    }
  }
</script>

<style scoped>

</style>
