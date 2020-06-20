<template>
  <div id="float-bar">
    <div class="icon-item" style="background-color: #20c997">快</div>
    <div class="icon-item" style="background-color: #28a745">捷</div>
    <div class="icon-item" style="background-color: #8cc354">方</div>
    <div class="icon-item" style="background-color: #cddc4b">式</div>
    <div style="width: 32px;height: 32px;border-radius: 8px;margin-right: 16px;border: 1px dashed #E2E2EA;display: flex;align-items: center;justify-content: center;color: #E2E2EA">
      <span class="icon iconfont iconic_Plus1"/>
    </div>
    <div style="flex:1"></div>
  </div>
</template>

<script>
  export default {
    name: 'floatbar'
  }
</script>

<style scoped>
  #float-bar{
    display: flex;
    align-items: center;
    position: absolute;
    padding: 0 20px;
    z-index: 9;
    border-top:1px solid #e2e2ea;
    box-sizing: border-box;
    background: rgba(255,255,255,1);
    width: 760px;
    height: 60px;
    bottom: 0;
  }
  .icon-item{
    width: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    background: black;
    position: relative;
    border-radius: 8px;
    margin-right: 16px;
  }
  .icon-item:first-child::after{
    content: "";
    position: absolute;
    top:34px;
    left: 13px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #3DD598;
  }

</style>
