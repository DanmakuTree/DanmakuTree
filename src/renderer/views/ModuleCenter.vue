<template>
  <div class="container">
    <h2 class="h2">插件中心</h2>
    <a-button @click="updateAllModuleList()">更新</a-button>
    <div class="module-list">
      <div class='module' v-for="Amodule in moduleList" :key="Amodule.id">
        <h3>{{Amodule.name}} <span>{{Amodule.version}}</span> </h3>
        <p>{{Amodule.description}}</p>
        <a-button v-if="!isInstalled(Amodule.id)&&!isInternal(Amodule.id)" type="primary" @click='install(Amodule.id)'>
          添加
        </a-button>
        <a-button v-if="isInternal(Amodule.id)" @click="install(Amodule.id)">
          内部模块（已自动加载）
        </a-button>
        <a-button v-if="isInstalled(Amodule.id)" @click="uninstall(Amodule.id)">
          移除
        </a-button>
        <a-button v-if="isInstalled(Amodule.id)" @click="clearConfig(Amodule.id)">
          清除设置
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        moduleId: 'b3a11260-c5e1-4edb-b7cc-23e8f6285f97',
        installedModuleList: [],
        moduleList: [],
        internalModuleList: []
      }
    },
    mounted () {
      this.$module.getAllModuleList().then((data) => {
        this.moduleList = data
      })
      this.loadInstallModuleList()
      this.loadInternalModuleList()
    },
    methods: {
      install (id) {
        return this.$module.installModule(id).then((res) => {
          if (res) {
            this.$message.success('成功')
          } else {
            this.$message.error('失败')
          }
          this.loadInstallModuleList()
        })
      },
      uninstall (id) {
        return this.$module.uninstallModule(id).then((res) => {
          if (res) {
            this.$message.success('成功')
          } else {
            this.$message.error('失败')
          }
          this.loadInstallModuleList()
        }).then(this.loadInstallModuleList)
      },
      clearConfig (id) {
        return this.$module.clearModuleConfig(id).then((res) => {
          if (res) {
            this.$message.success('成功')
          } else {
            this.$message.error('失败')
          }
        })
      },
      loadInstallModuleList () {
        return this.$module.getInstalledModuleList().then((data) => {
          this.installedModuleList = data
        })
      },
      isInstalled (id) {
        return this.installedModuleList.indexOf(id) !== -1
      },
      updateAllModuleList () {
        console.log('updating all module list')
        this.$module.getAllModuleList(true).then((data) => {
          this.moduleList = data
        })
      },
      loadInternalModuleList () {
        return this.$module.getInternalModuleList().then((data) => {
          this.internalModuleList = data
        })
      },
      isInternal (id) {
        return this.internalModuleList.indexOf(id) !== -1
      }
    }
  }
</script>

<style scoped>
.container {
  padding: 16px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #fafafa;
}
.module {
  margin: 10px 0;
  padding: 16px;
  border-radius: 16px;
  background-color: white;
}
</style>
