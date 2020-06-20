<template>
  <div style="flex: 1;padding: 16px 20px 80px 20px;overflow-y: scroll;background: #fafafb">
    <div style="margin-bottom: 8px">
      <span class="h2">直播间信息</span>
      <span style="font-family: Roboto-Regular,sans-serif;font-size: 13px;color: #92929D">你看不到我</span>
    </div>
    <div style="margin-bottom: 32px;display: flex;justify-content: space-between">
      <div style="height: 200px;background: black;width: 100%">1231</div>
<!--      <div style="width: 442px;height: 282px;position:relative;background: url('//i0.hdslb.com/bfs/archive/bdfe37e38e632a0008ad5ff985f9ce9f0c1371e0.jpg@412w_232h_1c_100q.jpg')">-->
<!--        <div style="position: absolute;bottom: 0;height:40px;left: 0;width: 100%;background: rgba(255,255,255,0.8);backdrop-filter: blur(20px)">-->
<!--          直播间标题 用户名等信息-->
<!--        </div>-->
<!--      </div>-->
<!--      <div style="width: 442px;height: 282px;"></div>-->
<!--      <div class="card-r" style="width: 246px;height: 282px;overflow-y: scroll;overflow-x: hidden;background: transparent">-->
<!--        <d-item/>-->
<!--        <d-item/>-->
<!--        <d-item/>-->
<!--        <d-item/>-->
<!--      </div>-->
    </div>
<!--    <div style="padding: 20px;background: white;border-radius: 16px">-->
<!--      <div class="test1">-->
<!--        <span style="flex: 1"/>-->
<!--        <my-input/>-->
<!--      </div>-->
<!--      <my-table/>-->
<!--    </div>-->

  </div>
</template>

<script>
  import mytable from '../components/table/mytable'
  import Input from '../components/form/input'
  import dItem from '../components/danmaku/item'
  export default {
    name: 'roomlist',
    components: {
      'd-item': dItem,
      'my-input': Input,
      'my-table': mytable
    }
  }
</script>

<style scoped>
  .test1{
    font-family: Poppins-SemiBold,sans-serif;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #171725;
    justify-content: space-between;
    font-weight: 500;
    letter-spacing: 1px;
    margin-bottom: 13px;
  }

</style>
