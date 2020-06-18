<template>
  <div style="flex: 1;padding: 16px 20px 80px 20px;overflow-y: scroll;background: #fafafb">
    <div style="margin-bottom: 8px">
      <span class="h2">直播间信息</span>
      <span style="font-family: Roboto-Regular,sans-serif;font-size: 13px;color: #92929D">你看不到我</span>
    </div>
    <div style="margin-bottom: 32px;display: flex;justify-content: space-between">
      <div style="width: 442px;height: 282px;background: black"></div>
      <div style="width: 246px;height: 282px;background: black"></div>
    </div>
    <div style="padding: 20px;background: white;border-radius: 16px">
      <div class="test1">
        次房间列表
        <my-input/>
      </div>
      <my-table/>
    </div>

  </div>
</template>

<script>
  import mytable from '../components/table/mytable'
  import Input from '../components/form/input'
  export default {
    name: 'roomlist',
    components: {
      'my-input':Input,
      'my-table': mytable
    }
  }
</script>

<style scoped>
  .test1{
    font-family: Poppins-SemiBold,sans-serif;
    display: inline-block;
    font-size: 12px;
    color: #171725;
    font-weight: 500;
    letter-spacing: 1px;
    margin-bottom: 13px;
  }

</style>
