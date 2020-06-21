import { app, ipcMain } from 'electron'
import { productName } from '../../package.json'
import { configure, getLogger } from 'log4js'
import { Platform } from './Platform'
import { isDev, version } from './Consts'
import { WebInterface } from './WebInterface'
import { ModuleManager } from './ModuleManager'
import { Main } from './Main'
import { WebsocketService } from './Services/WebsocketService'

// set app name
app.name = productName
// to hide deprecation message
app.allowRendererProcessReuse = true

// disable electron warning
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = false

const gotTheLock = app.requestSingleInstanceLock()

app.setAppLogsPath()

/**
 * @type {Logger}
 */
var logger
var logConfig = {
  appenders: {
    file: {
      type: 'dateFile',
      filename: app.getPath('logs') + '/main',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '[%d{hh:mm:ss}][%p][%c] %m'
      }
    },
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '[%d{hh:mm:ss}]%[[%p]%][%c] %[%m%]'
      }
    }
  },
  categories: {
    default: {
      appenders: [
        'console',
        'file'
      ],
      level: 'ALL'
    }
  }
}

var platform
var moduleManager

// only allow single instance of application
if (!isDev) {
  if (gotTheLock) {
    app.on('second-instance', () => {
      // Someone tried to run a second instance, we should focus our window.
      if (moduleManager.getMainWindow() && moduleManager.getMainWindow().isMinimized()) {
        moduleManager.getMainWindow().restore()
      }
      moduleManager.getMainWindow().focus()
    })
  } else {
    app.quit()
    process.exit(0)
  }
} else {
  // process.env.ELECTRON_ENABLE_LOGGING = true
  require('electron-debug')({
    showDevTools: false
  })
}

configure(logConfig)
logger = getLogger('Main')

app.on('ready', () => {
  logger.info(`DanmakuTree v${version} ready.`)
})

app.on('window-all-closed', () => {
  logger.info(`DanmakuTree v${version} All Window closed.`)
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  logger.info(`DanmakuTree v${version} activate.`)
})

platform = new Platform()
var webInterface = new WebInterface()
moduleManager = new ModuleManager()

var main = new Main()

webInterface.registry('Main', main)
webInterface.registry('Platform', platform)
webInterface.registry('Module', moduleManager)

ipcMain.handle('APICall', webInterface.getHandler())
main.Services.WebsocketService.handle('API', webInterface.getHandler())
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
