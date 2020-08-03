export function ConfigDataMixin (moduleId) {
  return {
    data () {
      return {
        dModuleConfig: null,
        dModuleData: null,
        dConfigDataLoad: null
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
    created () {
      var config = {}
      var data = {}
      var vm = this
      function ProxiedItem (prototype = {}) {
        return new Proxy(prototype, {
          get: (target, name) => {
            if (Object.keys(prototype).indexOf(name) === -1) {
              return prototype[name]
            }
            if (typeof prototype[name] === 'object' || typeof prototype[name] === 'function') {
              return ProxiedItem(prototype[name])
            } else if (typeof prototype[name] !== 'undefined') {
              return prototype[name]
            } else {
              return undefined
            }
          },
          set: function (obj, prop, value) {
            vm.$set(prototype, prop, value)
            return true
          }
        })
      };
      this.dModuleConfig = ProxiedItem(config)
      this.dModuleData = ProxiedItem(data)
      this.__onModuleConfigChange = (e) => {
        if (e.moduleId === moduleId) {
          this.dModuleConfig = ProxiedItem(JSON.parse(e.config))
        }
      }
      this.__onModuleDataChange = (e) => {
        if (e.moduleId === moduleId) {
          this.dModuleData = ProxiedItem(JSON.parse(e.data))
        }
      }
      var promises = []
      promises.push(window.API.Module.getModuleConfig(moduleId).then((newConfig) => {
        this.dModuleConfig = ProxiedItem(newConfig)
      }))
      promises.push(window.API.Module.getModuleData(moduleId).then((newData) => {
        this.dModuleData = ProxiedItem(newData)
      }))
      this.dConfigDataLoad = Promise.all(promises)
      window.API.event.on('Module.configChange', this.__onModuleConfigChange)
      window.API.event.on('Module.dataChange', this.__onModuleDataChange)
    },
    beforeDestroy () {
      window.API.event.removeListener('Module.configChange', this.__onModuleConfigChange)
      window.API.event.removeListener('Module.dataChange', this.__onModuleDataChange)
    }
  }
}
