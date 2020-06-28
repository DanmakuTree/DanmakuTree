<template>
  <div style="flex:1;display: flex;flex-direction: column;justify-content: center;align-items: center">
    <a-spin>
      <a-icon
        slot="indicator"
        type="loading"
        style="font-size: 42px"
        spin />
    </a-spin>
    <div style="margin-top: 8px">
      加载中,请稍后...
    </div>
  </div>
</template>

<script>
  export default {
    name: 'initializingmodal'
  }
</script>

<style scoped>

</style>
