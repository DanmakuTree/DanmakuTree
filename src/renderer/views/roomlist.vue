<template>
  <div style="flex: 1;padding: 16px 20px 80px 20px;overflow-y: scroll;background: #fafafb">
    <div style="margin-bottom: 8px">
      <span class="h2">房间列表</span>
      <a-input placeholder="输入房间号添加..." class="d-input" style="width: 180px;height:30px;float: right"/>
    </div>
    <!--    <div style="margin-bottom: 32px;display: flex;justify-content: space-between">-->
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
    <!--    </div>-->
    <div style="padding: 16px;background: white;border-radius: 16px">
      <div class="test1">
        <div style="height: 100px;width:200px;background: #171725;color: white;border-radius: 8px">
          直播间封面
        </div>
        <div style="flex: 1;margin-left: 16px;display: flex;flex-direction: column;">
          <div>直播间标题长长长长长长长长长长...</div>
          <div>房间ID、用户名
            <span>
              <a-tag color="pink" style="transform: scale(0.8)">
                分区
              </a-tag>
            </span>
          </div>
          <br/>
          <br/>
          <div>
            <span>进入网页</span>
          </div>
        </div>
      </div>
      <my-table/>
    </div>

  </div>
</template>

<script>
  import mytable from '../components/table/mytable'
  import Input from '../components/form/input'
  import dItem from '../components/danmaku/item'
  export default {
    name: 'd_roomlist',
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
    font-size: 12px;
    color: #171725;
    font-weight: 500;
    letter-spacing: 1px;
    margin-bottom: 18px;
  }

</style>
