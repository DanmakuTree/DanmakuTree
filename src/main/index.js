import { app, BrowserWindow, ipcMain, webContents } from 'electron'
import { productName } from '../../package.json'
import { configure, getLogger } from 'log4js'
import { Platform } from './Platform'
import { eventBus } from './EventBus'
import { isDev, isDebug, MainWindowPage, MainPreloadScript, CaptchaPreloadScript, ModulePreloadScript } from './Consts'
import { WebInterface } from './WebInterface'
import { WebInterfaceBase } from './WebInterfaceBase'
import Services from './Services'

// set app name
app.name = productName
// to hide deprecation message
app.allowRendererProcessReuse = true

// disable electron warning
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = false

const gotTheLock = app.requestSingleInstanceLock()

/**
 * @type {BrowserWindow}
 */
let mainWindow

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

// only allow single instance of application
if (!isDev) {
  if (gotTheLock) {
    app.on('second-instance', () => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow && mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
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

async function installDevTools () {
  try {
    /* eslint-disable */
    logger.info("Installing Vue-Devtools")
    require('vue-devtools').install()
    /* eslint-enable */
  } catch (err) {
    logger.error('Install Vue-Devtools fail,', err)
  }
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    backgroundColor: '#fff',
    width: 960,
    height: 540,
    minWidth: 960,
    minHeight: 540,
    // useContentSize: true,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      webSecurity: false,
      webviewTag: true,
      preload: MainPreloadScript
    },
    fullscreenable: false,
    maximizable: false,
    resizable: false,
    frame: false,
    show: false
  })

  // load root file/url
  mainWindow.loadURL(MainWindowPage)
  if (!isDev) {
    global.__static = require('path')
      .join(__dirname, '/static')
      .replace(/\\/g, '\\\\')
  }

  // Show when loaded
  mainWindow.on('ready-to-show', () => {
    logger.info('MainWindow Ready')
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    logger.info('Application exiting...')
  })
}

app.on('ready', () => {
  createWindow()

  if (isDev) {
    installDevTools()
    mainWindow.webContents.openDevTools()
  }

  if (isDebug) {
    mainWindow.webContents.openDevTools()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

var webInterface = new WebInterface()

webInterface.registry('Platform', new Platform())

var main = new WebInterfaceBase()
main.Services = Services
main.available.push('Services')

webInterface.registry('Main', main)

ipcMain.handle('APICall', webInterface.getHandler())

eventBus.on('ALLPUBLIC', (e) => {
  try {
    mainWindow.webContents.send('event', e)
  } catch (error) {
    logger.info(`send ${e.name} event fail`, error)
  }
})
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
