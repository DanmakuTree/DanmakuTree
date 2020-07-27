export function ConfigDataMixin (moduleId) {
  console.log(moduleId)
  return {
    data () {
      return {
        dModuleConfig: {},
        dModuleData: {}
      }
    },
    watch: {
      dModuleConfig: {
        handler (newConfig, previousConfig) {
          if (newConfig === previousConfig) {
            this.$module.updateModuleConfig(moduleId, newConfig)
          }
        },
        deep: true
      },
      dModuleData: {
        handler (newData, previousData) {
          if (newData === previousData) {
            this.$module.updateModuleData(moduleId, newData)
          }
        },
        deep: true
      }
    },
    mounted () {
      this.__onModuleConfigChange = (e) => {
        if (e.moduleId === moduleId) {
          this.dModuleConfig = JSON.parse(e.config)
        }
      }
      this.__onModuleDataChange = (e) => {
        if (e.moduleId === moduleId) {
          this.dModuleData = JSON.parse(e.data)
        }
      }
      window.API.Module.getModuleConfig(moduleId).then((config) => {
        this.dModuleConfig = config
      })
      window.API.Module.getModuleData(moduleId).then((data) => {
        this.dModuleData = data
      })
      window.API.event.on('Module.configChange', this.__onModuleConfigChange)
      window.API.event.on('Module.dataChange', this.__onModuleDataChange)
    },
    beforeDestroy () {
      window.API.event.removeListener('Module.configChange', this.__onModuleConfigChange)
      window.API.event.removeListener('Module.dataChange', this.__onModuleDataChange)
    }

  }
}
