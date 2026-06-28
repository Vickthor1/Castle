import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import './windowsIntegration'
import { registerLibraryStorageHandlers } from './libraryStorage'
import { initializeSettings, registerSettingsHandlers } from './settings'
import { createTray, hideWindowToTray, registerTrayHandlers, setMainWindow, showWindow } from './tray'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    showWindow()
    return mainWindow
  }

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  })

  mainWindow = win
  setMainWindow(win)

  win.on('close', (event) => {
    event.preventDefault()
    hideWindowToTray()
  })

  win.on('minimize', (event: Electron.Event) => {
    event.preventDefault()
    hideWindowToTray()
  })

  const devUrl = 'http://localhost:5173'
  if (process.env.NODE_ENV === 'development') {
    win.loadURL(devUrl)
  } else {
    win.loadFile(join(__dirname, '../dist/index.html'))
  }

  win.once('ready-to-show', () => {
    const shouldStartHidden = process.argv.includes('--hidden') || process.argv.includes('--processStart')
    if (shouldStartHidden) {
      hideWindowToTray()
    } else {
      win.show()
    }
  })

  return win
}

app.whenReady().then(() => {
  registerLibraryStorageHandlers()
  registerSettingsHandlers()
  registerTrayHandlers()
  initializeSettings()
  createWindow()
  createTray()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    else showWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.hide()
    }
  }
})
