import { app, BrowserWindow, Menu, Tray, ipcMain } from 'electron'
import path from 'path'

let tray: Tray | null = null
let mainWindow: BrowserWindow | null = null

function getIconPath() {
  const iconPath = path.join(__dirname, '..', 'build', 'icon.png')
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
