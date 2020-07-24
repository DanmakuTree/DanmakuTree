<template>
  <div id="float-bar">
    <!-- TODO:
    显示list中的按钮 -->
    <div class="icon-item" style="background-color: #20c997" @click="action(list[0])">快</div>
    <div class="icon-item" style="background-color: #28a745">捷</div>
    <div class="icon-item" style="background-color: #8cc354">方</div>
    <div class="icon-item" style="background-color: #cddc4b">式</div>
    <div style="width: 32px;height: 32px;border-radius: 8px;margin-right: 16px;border: 1px dashed #E2E2EA;display: flex;align-items: center;justify-content: center;color: #E2E2EA" @click="openSetting">
      <span class="icon iconfont iconic_Settings"/>
    </div>
    <div style="flex:1"></div>
  </div>
</template>

<script>
  export default {
    name: 'floatbar',
    data: function () {
      return {
        list: []
      }
    },
    danmaku: {
      'Module.gotRequestQuickLink' (link) {
        this.onGotRequestQuickLink(link)
      }
    },
    mounted () {
      this.loadList()
    },
    methods: {
      action (link) {
        switch (link.action) {
        case 'createModuleExternalWindow':
          // 创建窗口
          this.$module.createModuleExternalWindow(link.moduleId, link.data).then(console.log).catch(console.error)
          break
        default:
          // 未知
          this.$message.error(`Unknown Action: ${link.action}`)
          break
        }
      },
      loadList () {
        // 添加列表
        this.$module.getQuickLinkList().then((list) => {
          this.list = list
        }).catch(console.error)
      },
      saveList () {
        // 保存列表
        this.$module.updateQuickLinkList(this.list).then(() => {
          // no thing.
        }).catch(console.error)
      },
      onGotRequestQuickLink (link) {
        // 接到请求添加快捷方式会调用这个
        console.log('快捷方式来源模块id', link.icon)
        console.log('快捷方式图标地址，可能没有,没有你就生成个然后存base64吧', link.icon)
        console.log('快捷方式动作', link.action)
        console.log('快捷方式名称', link.name)
        console.log('快捷方式携带数据，可能没有', link.data)
        // TODO: 弹窗确认
        // 确认后
        // this.list.push(link)
        // this.saveList()
      },
      openSetting () {
        // 打开设置模态框
        /**
         * 设置页面要求
         * 1 可调序 可删除
         * 2 指下去可以有大概信息,不要显示数据
         * 3 立刻生效
         */
      }
    }
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

</style>
