import { app, BrowserWindow, Menu, Tray, ipcMain } from 'electron'
import fs from 'fs'
import path from 'path'

let tray: Tray | null = null
let mainWindow: BrowserWindow | null = null

function getIconPath() {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'icones', 'castle.ico')
    : path.resolve(__dirname, '..', 'icones', 'castle.ico')

  if (fs.existsSync(iconPath)) {
    return iconPath
  }

  const fallbackPath = app.isPackaged
    ? path.join(process.resourcesPath, 'icones', 'castle.png')
    : path.resolve(__dirname, '..', 'icones', 'castle.png')

  if (fs.existsSync(fallbackPath)) {
    console.warn(`Tray icon not found at ${iconPath}, falling back to ${fallbackPath}`)
    return fallbackPath
  }

  console.error(`Tray icon not found at ${iconPath} or ${fallbackPath}`)
  return iconPath
}

export function setMainWindow(win: BrowserWindow) {
  mainWindow = win
}

export function createTray() {
  if (tray) return tray

  tray = new Tray(getIconPath())
  tray.setToolTip('Castle Launcher')
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Abrir Launcher',
      click: () => showWindow()
    },
    {
      type: 'separator'
    },
    {
      label: 'Sair',
      click: () => {
        app.quit()
      }
    }
  ]))

  tray.on('click', () => showWindow())
  return tray
}

export function showWindow() {
  if (!mainWindow) return
  if (mainWindow.isMinimized()) mainWindow.restore()
  if (!mainWindow.isVisible()) mainWindow.show()
  mainWindow.show()
  mainWindow.focus()
}

export function hideWindowToTray() {
  if (!mainWindow) return
  if (mainWindow.isVisible()) mainWindow.hide()
}

export function destroyTray() {
  if (tray) {
    tray.destroy()
    tray = null
  }
}

export function registerTrayHandlers() {
  ipcMain.handle('tray:show', () => showWindow())
  ipcMain.handle('tray:hide', () => hideWindowToTray())
  ipcMain.handle('tray:quit', () => {
    destroyTray()
    app.quit()
  })
}
