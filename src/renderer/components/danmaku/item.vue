<template>
  <div class="d-item" style="position:relative;background: #FAFAFB;margin-left:6px;margin-bottom:12px;border-radius: 16px;height: min-content;padding: 10px 20px;display: flex;flex-direction: column">
    <div style="font-family: Poppins-SemiBold,sans-serif;font-size: 12px;color: #171725;font-weight: 500;margin-left: 12px;display: flex;align-items: center">
      <div>
        <span>mano233</span>
        <span style="background-color: #FAFAFB;color: #171725">房管</span>
        <span style="background-color: #FAFAFB;color: #171725">舰队</span>
        <span style="background-color: #FAFAFB;color: #171725">粉丝等级</span>
        <span style="background-color: #FAFAFB;color: #171725">活动头衔</span>
        <span style="background-color: #FAFAFB;color: #171725">用户等级</span>

      </div>
      <div class="user">
        <span class="icon iconfont iconic_Someonesactivity" style="font-size: 12px;"></span>
      </div>
      <span style="flex: 1"/>
      <span style="font-family: Roboto-Regular;font-size: 10px;color: #92929D;margin-right: 32px">12:06:03</span>
      <a-popover placement="bottom" trigger="click">
        <ul slot="content" style="font-size: 11px">
          <li>复制用户id</li>
          <li>封禁用户</li>
          <li>任命房管</li>
        </ul>
        <span class="icon iconfont iconic_More1" style="color: #92929D"/>
      </a-popover>
    </div>
    <div
      style="overflow-wrap: break-word;font-family: Roboto-Regular,sans-serif;
    font-size: 11px;color: #44444F;line-height: 16px;letter-spacing: 1px;
    margin-left: 12px;margin-top: 6px;">
      根据 W3C CSS 2.1 规范中的描述，'lett
    </div>
  </div>
</template>

<script>
  export default {
    name: 'dItem',
    data: () => {
      return {
        v: true
      }
    }
  }
</script>

<style scoped>
  .user{
    top:5px;
    left: -5px;
    border-radius: 50%;
    border:1px solid #F1F1F5;
    position: absolute;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: white;
    background: #A461D8;
  }

</style>
