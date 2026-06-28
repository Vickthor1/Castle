import { app, BrowserWindow, shell } from 'electron'
import fs from 'fs'
import { join, dirname } from 'path'
import './windowsIntegration'
import { registerLibraryStorageHandlers } from './libraryStorage'
import { initializeSettings, registerSettingsHandlers } from './settings'
import { createTray, hideWindowToTray, registerTrayHandlers, setMainWindow, showWindow } from './tray'
import { setupAutoUpdater } from './updater'

let mainWindow: BrowserWindow | null = null
let splashWindow: BrowserWindow | null = null

const hasSingleInstanceLock = app.requestSingleInstanceLock()

if (!hasSingleInstanceLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      showWindow()
      mainWindow.focus()
    } else {
      createWindow()
    }
  })
}

function getBuildAssetPath(fileName: string) {
  return app.isPackaged ? join(process.resourcesPath, fileName) : join(__dirname, '../build', fileName)
}

function getIconPath(fileName: string) {
  return app.isPackaged
    ? join(process.resourcesPath, 'icones', fileName)
    : join(__dirname, '../icones', fileName)
}

function createDesktopShortcut() {
  if (process.platform !== 'win32' || !app.isPackaged) return

  const desktopPath = app.getPath('desktop')
  const shortcutPath = join(desktopPath, 'Castle.lnk')
  const appPath = process.execPath

  if (fs.existsSync(shortcutPath)) return

  try {
    shell.writeShortcutLink(shortcutPath, {
      target: appPath,
      cwd: dirname(appPath),
      description: 'Castle Launcher',
      icon: getIconPath('castle.ico'),
      iconIndex: 0
    })
  } catch (error) {
    console.error('Falha ao criar atalho na área de trabalho:', error)
  }
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
    icon: process.platform === 'win32' ? getIconPath('castle.ico') : undefined,
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
  const isDevelopment = !app.isPackaged || process.env.NODE_ENV === 'development'

  if (isDevelopment) {
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
    createDesktopShortcut()
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
