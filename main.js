const path = require('path')
const { app, BrowserWindow, globalShortcut, Tray } = require('electron')
const trayIconPath = path.join(__dirname, 'assets/translate_icon.png')
const bgIconPath = path.join(__dirname, 'assets/translate_icon_bg_@1024.icns')

let tray = null
let win = null

/**
 * app
 * **/
// Don't show the app in the doc
app.dock.hide()

// Run the application
app.whenReady()
  .then(async () => {
    await createWindow()
    createTray()

    if (process.env.NODE_ENV === 'dev') {
      // hot reload
      require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
      });

      // devtools
      win.webContents.openDevTools()
    }
  })
  .catch(e => {
    console.log(e)
  })

// Catch the Cmd + Q event
app.on('window-all-closed', () => {
  app.quit()
})

/**
 * tray
 * **/
const toggleWindow = () => {
  if (win.isVisible()) return win.hide()
  win.show()
}

const createTray = () => {
  tray = new Tray(trayIconPath)
  tray.setIgnoreDoubleClickEvents(true)

  globalShortcut.register('Command+Control+up', () => {
    toggleWindow()
  })

  tray.on('click', () => {
    toggleWindow()
  })
}

/**
 * window
 * **/
// Initialize the window of electronJS
const createWindow = async () => {
  win = new BrowserWindow({
    width: 719,
    height: 500,
    webPreferences: {
      // All of the Node.js APIs are available in the preload process.
      // preload: path.join(__dirname, 'preload.js')
    },
    show: false,
    alwaysOnTop: true,
    // skipTaskbar: true,
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    icon: bgIconPath
  })


  // const trayPosition = tray.getBounds()
  const mainWindowPosition = win.getBounds()
  // TODO: application window must be moved to the bottom of tray icon.
  win.setPosition(mainWindowPosition.x, 0)

  win.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true
  })

  // Storage data is cleared.
  const ses = win.webContents.session
  await ses.clearStorageData()

  await win.loadURL('https://translate.google.co.kr/?hl=ko&sl=en&tl=ko&op=translate')
}