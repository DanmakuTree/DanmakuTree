<template>
  <div id="nav-bar">
    <div style="padding: 16px 8px">
      <div class="card-border" style="padding: 8px">
        <div style="display: flex;align-items: center">
          <div style="width: 32px;height: 32px;border-radius: 50%;background: black">
          </div>
          <div style="margin-left: 8px;display: flex;flex-direction: column;justify-content: space-between" @click="login">
            <div style="font-size: 11px;font-weight: bold;color: #171725">mano233</div>
            <div style="font-size: 11px;">哔哩哔哩</div>
          </div>
        </div>
      </div>
    </div>
    <router-link
      v-for="(item,index) in menuitems"
      class="nav-item slide-menu"
      :key="index"
      :to="{ path: item.to}"
      active-class="active">
      <div style="margin-left: 13px;margin-right: 16px">
        <span :class="'icon iconfont '+item.icon" style="font-size: 20px"></span>
      </div>
      <span>{{item.title}}</span>
    </router-link>
    <div style="margin-top: 16px;height: 40px;line-height: 40px;padding: 0 16px;font-size: 10px;color: #92929D;letter-spacing: 1px">
      插件列表
    </div>
    <ul style="flex: 1;overflow-y: scroll">
      <div style="height: 40px;line-height: 40px;padding: 0 16px;display: flex;align-items: center">
        <div style="width: 26px;height: 26px;border-radius: 8px;background: #26ade3;margin-right: 12px;line-height: 26px;color: white;text-align: center;font-size: 12px">
          插
        </div>
        <span class="title-h5-middle">弹幕悬浮窗</span>
      </div>
      <div style="height: 40px;line-height: 40px;padding: 0 16px;display: flex;align-items: center">
        <div style="width: 26px;height: 26px;border-radius: 8px;background: #A461D8;margin-right: 12px;line-height: 26px;color: white;text-align: center;font-size: 12px">
          件
        </div>
        <span class="title-h5-middle">礼物图标</span>
      </div>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'NavMenu',
    data () {
      return {
        menuitems: [
          {
            title: '首页',
            icon: 'iconic_Dashboard',
            to: '/home'
          },
          {
            title: '房间管理',
            icon: 'iconic_Friends',
            to: '/roomlist'
          },
          {
            title: '历史弹幕',
            icon: 'iconic_File',
            to: '/history'
          },
          {
            title: '插件中心',
            icon: 'iconic_Sales',
            to: '/2'
          },
          {
            title: '系统设置',
            icon: 'iconic_Settings1',
            to: '/1'
          }
        ]
      }
    },
    methods: {
      login () {
        console.log('click')
        this.$store.commit('showLoginModal')
      },
      quit () {
        window.API.Quit()
      }
    }
  }
</script>

<style scoped>
  .nav-item.active{
    color: #0062ff;
  }
  .nav-item.active:before{
    visibility: visible;
  }
  .nav-item:hover:not(.active){

  }
  .nav-item:before{
    content: "";
    visibility: hidden;
    height: 26px;
    width: 2px;
    background: #0062FF;
    border-radius: 0 80px 80px 0;
  }
  .nav-item{
    height: 40px;
    display: flex;
    align-items: center;
    font-family: Poppins-SemiBold,sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #171725;
  }
  #nav-bar{
    width: 200px;
    background: white;
    border-right: 1px solid #e2e2ea;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
</style>
