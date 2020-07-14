<template>
  <div class="container">
    <ul class="content" ref="content">
      <div class="space"></div>
      <li class="item" v-for="item in normalList" :key="item.id">
        <item :data="item" :options="op"/>
      </li>
    </ul>
    <div style="font-size: 16px;color: black;-webkit-app-region: drag;" @click="stop">点击暂停获取</div>
  </div>
</template>

<script>

  import item from './item'
  // 默认设置选项
  const defaultOptions = {
    // 弹幕内容颜色
    color: '#26ace3',
    // 字号
    fontSize: '14px',
    // 显示舰队标示
    showGuardIcon: true,
    // 显示粉丝勋章
    showFansIcon: true,
    // 显示用户名
    showUserName: true,
    // 显示用户等级
    showUserLevel: true,
    // 显示弹幕内容
    showContent: true
  }

  export default {
    name: 'index',
    components: {
      'item': item
    },
    computed: {
      op () {
        return defaultOptions
        // return Object.assign(defaultOptions, this.options || {})
      }
    },
    data () {
      return {
        // 保存normal弹幕信息
        normalList: [],
        // 是否保持在底部（自动滚动）
        keepBottom: true
      }
    },
    updated () {
      // 自动滚动
      const ele = this.$refs.content
      if (this.keepBottom) {
        ele.scrollTop = ele.scrollHeight
      }
      // 最多显示30个
      if (this.normalList.length > 30) {
        this.normalList.shift()
      }
    },
    created () {
    },
    mounted () {

    },
    methods: {
      stop () {

      }
    }
  }
</script>

<style scoped>
  .space{
    flex: 1;
  }
  .container{
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: rgba(0,0,0,.8);
    transition: all 1s;
  }
  .content{
    display: flex;
    height: 100%;
    scroll-behavior:smooth;
    flex-direction: column;
    overflow: hidden;
  }
  .content::-webkit-scrollbar{
    display: none;
  }
  .item{
    color: gainsboro;
    padding: 4px;
    transition: all 300ms;
  }
</style>
