<template>
  <Component :is="computedComponent" />
</template>

<script>
  import fail from './Error'
  import { ConfigDataMixin } from '../mixins/ConfigDataMixin'
  async function externalComponent (config, id, moduleId, isDev = false) {
    const name = config.js.split('/').reverse()[0].match(/^(.*?)\.js/)[1]
    if (window[name] && !isDev) return window[name]
    window[name] = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      const style = document.createElement('link')
      script.id = `module-script-${id}`
      style.id = `module-style-${id}`
      script.async = true
      script.addEventListener('load', () => {
        resolve(window[name])
      })
      script.addEventListener('error', () => {
        reject(new Error(`Error loading ${config.js}`))
      })
      script.src = config.js
      style.rel = 'stylesheet'
      style.href = config.css
      document.head.appendChild(style)
      document.head.appendChild(script)
    }).then((e) => {
      if (!e.default.mixins) {
        e.default.mixins = []
      }
      e.default.mixins.push(ConfigDataMixin(moduleId))
      return e
    })

    return window[name]
  }

  export default {
    name: 'module',
    data () {
      return {
        failed: false,
        computedComponent: null,
        module: null,
        id: Math.floor(Math.random() * 16777215).toString(16),
        ws: null,
        isDev: false
      }
    },
    mounted () {
      this.$main.isDev().then((e) => {
        this.isDev = e
      }).then(this.load())
    },
    destroyed () {
      this.unload()
    },
    methods: {
      load () {
        this.$module.getModuleInfo(this.$route.params.id).then((data) => {
          this.module = data
          this.loadAsset()
          if (this.isDev && this.module.embed.reloadNotice) {
            this.ws = new WebSocket(this.module.embed.reloadNotice)
            this.ws.onmessage = (e) => {
              if (e.data === 'reload') {
                this.unloadAsset()
                this.loadAsset()
              }
            }
          }
        })
      },
      loadAsset () {
        this.computedComponent = async () => {
          return externalComponent(this.module.embed, this.id, this.module.id, this.isDev).catch((e) => {
            console.error(e)
            return fail
          })
        }
      },
      unloadAsset () {
        try {
          document.head.querySelector(`#module-style-${this.id}`).remove()
        } catch (error) { }
        try {
          document.head.querySelector(`#module-script-${this.id}`).remove()
        } catch (error) { }
      },
      unload () {
        this.unloadAsset()
        if (this.ws) {
          this.ws.close()
          this.ws = null
        }
      }
    }
  }
</script>
