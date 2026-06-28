import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import './windowsIntegration'
import { registerLibraryStorageHandlers } from './libraryStorage'
import { initializeSettings, registerSettingsHandlers } from './settings'
import { createTray, hideWindowToTray, registerTrayHandlers, setMainWindow, showWindow } from './tray'
import { setupAutoUpdater } from './updater'

let mainWindow: BrowserWindow | null = null
let splashWindow: BrowserWindow | null = null

function getBuildAssetPath(fileName: string) {
  return app.isPackaged ? join(process.resourcesPath, 'build', fileName) : join(__dirname, '../build', fileName)
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 420,
    height: 280,
    frame: false,
    alwaysOnTop: true,
    center: true,
    resizable: false,
    show: true,
    backgroundColor: '#0b1020',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  void splashWindow.loadFile(getBuildAssetPath('splash.html'))
}

function destroySplashWindow() {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.close()
  }
  splashWindow = null
}

function createWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    showWindow()
    return mainWindow
  }

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    title: 'Castle',
    icon: process.platform === 'win32' ? getBuildAssetPath('icon.png') : undefined,
    backgroundColor: '#0b1020',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
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

  if (app.isPackaged) {
    setTimeout(() => {
      if (!win.isDestroyed()) win.show()
    }, 600)
  }

  return win
}

app.whenReady().then(() => {
  app.setAppUserModelId('com.example.castle')
  registerLibraryStorageHandlers()
  registerSettingsHandlers()
  registerTrayHandlers()
  initializeSettings()

  if (app.isPackaged) {
    createSplashWindow()
    setTimeout(() => {
      createWindow()
      destroySplashWindow()
    }, 1200)
  } else {
    createWindow()
  }

  createTray()
  if (app.isPackaged) {
    setupAutoUpdater()
  }

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
