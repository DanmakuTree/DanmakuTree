<template>
  <webview src="https://account.bilibili.com/ajax/miniLogin/minilogin " style="height: 100%;width: 100%" ref="view"/>
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
    }

  }
</script>

<style scoped>

</style>
