/**
 * TrayIcon.js, is
 *
 * modified from: tray_icon.js https://github.com/signalapp/Signal-Desktop/blob/development/app/tray_icon.js
 * and dock_icon.js https://github.com/signalapp/Signal-Desktop/blob/development/app/dock_icon.js
 *
 * with file name changed. No Need to "mock" Electron API since this file is not used by backend.
 *
 * But it need to connect with EventBus in order to monitor the state of programe
 **/
import path from 'path'
import { existsSync } from 'fs'
import { app, Menu, Tray, nativeImage, dialog } from 'electron'
import { eventBus } from './EventBus'
import { isDev } from './Consts'
const dockIcon = {}

let trayContextMenu = null
let tray = null

export function createTrayIcon (getMainWindow) {
  // A smaller icon is needed on macOS
  // const iconSize = process.platform === 'darwin' ? '16' : '256'
  const iconNoNewMessages = isDev
    ? path.join(
      __dirname,
      '..',
      '..',
      '_icons',
      'icon.png' // `icon_${iconSize}.png`
    )
    : path.join(
      __dirname,
      '..',
      '_icons',
      'icon.png' // `icon_${iconSize}.png`
    )

  tray = new Tray(nativeImage.createEmpty())
  tray.setImage(iconNoNewMessages)

  tray.forceOnTop = mainWindow => {
    if (mainWindow) {
      // On some versions of GNOME the window may not be on top when restored.
      // This trick should fix it.
      // Thanks to: https://github.com/Enrico204/Whatsapp-Desktop/commit/6b0dc86b64e481b455f8fce9b4d797e86d000dc1
      mainWindow.setAlwaysOnTop(true)
      mainWindow.focus()
      mainWindow.setAlwaysOnTop(false)
    }
  }

  tray.firstBoot = true

  tray.toggleWindowVisibility = () => {
    tray.firstBoot = false

    const mainWindow = getMainWindow()
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
        dockIcon.hide()
      } else {
        mainWindow.show()
        dockIcon.show()

        tray.forceOnTop(mainWindow)
      }
    }
    tray.updateContextMenu()
  }

  tray.showWindow = () => {
    const mainWindow = getMainWindow()
    if (mainWindow) {
      if (!mainWindow.isVisible()) {
        mainWindow.show()
      }

      tray.forceOnTop(mainWindow)
    }
    tray.updateContextMenu()
  }

  tray.updateContextMenu = () => {
    const mainWindow = getMainWindow()

    // NOTE: we want to have the show/hide entry available in the tray icon
    // context menu, since the 'click' event may not work on all platforms.
    // For details please refer to:
    // https://github.com/electron/electron/blob/master/docs/api/tray.md.
    trayContextMenu = Menu.buildFromTemplate([
      {
        id: 'toggleWindowVisibility',
        label:
          (mainWindow && mainWindow.isVisible()) || tray.firstBoot ? 'Hide' : 'Show',
        click: tray.toggleWindowVisibility
      },
      {
        id: 'quit',
        label: 'Quit',
        click: tray.quit
      }
    ])

    tray.setContextMenu(trayContextMenu)
  }

  tray.updateIcon = unreadCount => {
    let image

    if (unreadCount > 0) {
      const filename = 'icon.png' // `${String(unreadCount >= 10 ? 10 : unreadCount)}.png`
      image = isDev
        ? path.join(__dirname, '..', '..', '_icons', filename) // 'alert', iconSize, filename)
        : path.join(__dirname, '..', '_icons', filename) // 'alert', iconSize, filename)
    } else {
      image = iconNoNewMessages
    }

    if (!existsSync(image)) {
      console.log('tray.updateIcon: Image for tray update does not exist!')
      return
    }
    try {
      tray.setImage(image)
    } catch (error) {
      console.log(
        'tray.setImage error:',
        error && error.stack ? error.stack : error
      )
    }
  }

  tray.quit = () => {
    dialog.showMessageBox({
      type: 'warning',
      message: '真的要退出弹幕树吗？',
      buttons: ['是', '否'],
      defaultId: 0,
      cancelId: 1
    }).then((res) => {
      if (res.response === 0) {
        eventBus.emit('Main.quit')
      }
    })
  }

  tray.on('click', tray.showWindow)

  tray.setToolTip('DanmakuTree Desktop')
  tray.updateContextMenu()

  return tray
}

dockIcon.show = () => {
  if (process.platform === 'darwin') {
    app.dock.show()
  }
}

dockIcon.hide = () => {
  if (process.platform === 'darwin') {
    app.dock.hide()
  }
}
