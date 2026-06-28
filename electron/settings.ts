import { app, dialog, globalShortcut, ipcMain } from 'electron'
import fs from 'fs'
import Store from 'electron-store'

export type AppSettings = {
  theme: 'dark' | 'light' | 'system'
  language: 'pt-BR' | 'en' | 'es'
  startWithWindows: boolean
  monitoredFolders: string[]
  globalShortcut: string
  autoSave: boolean
}

const store = new Store<{ settings: AppSettings }>({ name: 'castle-settings' })

export function getDefaultSettings(): AppSettings {
  return {
    theme: 'dark',
    language: 'pt-BR',
    startWithWindows: false,
    monitoredFolders: [],
    globalShortcut: process.platform === 'darwin' ? 'Command+Space' : 'Control+Space',
    autoSave: true
  }
}

export function getSettings(): AppSettings {
  return (store.get('settings') as AppSettings | undefined) ?? getDefaultSettings()
}

export function setSettings(next: AppSettings): AppSettings {
  store.set('settings', next)
  applyStartupSetting(next.startWithWindows)
  registerGlobalShortcut(next.globalShortcut)
  return next
}

export function addMonitoredFolder(folder: string): string[] {
  const current = getSettings().monitoredFolders
  const next = current.includes(folder) ? current : [...current, folder]
  setSettings({ ...getSettings(), monitoredFolders: next })
  return next
}

export function removeMonitoredFolder(folder: string): string[] {
  const next = getSettings().monitoredFolders.filter((entry) => entry !== folder)
  setSettings({ ...getSettings(), monitoredFolders: next })
  return next
}

function applyStartupSetting(enabled: boolean) {
  if (process.platform !== 'win32') return
  try {
    app.setLoginItemSettings({
      openAtLogin: enabled,
      path: process.execPath,
      args: ['--processStart', 'castle']
    })
  } catch {
    // ignore platform limitations in development builds
  }
}

function normalizeAccelerator(accelerator: string) {
  return accelerator
    .replace(/\s+/g, '')
    .replace(/commandorcontrol/i, process.platform === 'darwin' ? 'Command' : 'Control')
    .replace(/ctrl/i, process.platform === 'darwin' ? 'Command' : 'Ctrl')
    .replace(/cmd/i, 'Command')
    .replace(/opt/i, 'Alt')
    .replace(/altgr/i, 'Alt')
}

export function registerGlobalShortcut(accelerator: string) {
  globalShortcut.unregisterAll()
  const normalized = normalizeAccelerator(accelerator || 'Control+Space')
  if (!normalized?.trim()) return
  try {
    globalShortcut.register(normalized, () => {
      const { BrowserWindow } = require('electron')
      const windows = BrowserWindow.getAllWindows()
      const win = windows[0]
      if (!win) return
      if (win.isVisible()) {
        win.hide()
      } else {
        if (win.isMinimized()) win.restore()
        win.show()
        win.focus()
      }
    })
  } catch {
    // ignore invalid accelerators
  }
}

export async function backupSettingsToFile() {
  const result = await dialog.showSaveDialog({
    title: 'Backup de configurações',
    defaultPath: 'castle-settings-backup.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  })

  if (result.canceled || !result.filePath) return null
  fs.writeFileSync(result.filePath, JSON.stringify(getSettings(), null, 2), 'utf8')
  return result.filePath
}

export async function restoreSettingsFromFile() {
  const result = await dialog.showOpenDialog({
    title: 'Restaurar configurações',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  })

  if (result.canceled || !result.filePaths?.[0]) return null
  const content = fs.readFileSync(result.filePaths[0], 'utf8')
  const parsed = JSON.parse(content) as AppSettings
  return setSettings(parsed)
}

export function resetSettings() {
  const defaults = getDefaultSettings()
  store.set('settings', defaults)
  applyStartupSetting(defaults.startWithWindows)
  registerGlobalShortcut(defaults.globalShortcut)
  return defaults
}

export function registerSettingsHandlers() {
  ipcMain.handle('settings:get', () => getSettings())
  ipcMain.handle('settings:set', (_event: any, settings: AppSettings) => setSettings(settings))
  ipcMain.handle('settings:addFolder', (_event: any, folder: string) => addMonitoredFolder(folder))
  ipcMain.handle('settings:removeFolder', (_event: any, folder: string) => removeMonitoredFolder(folder))
  ipcMain.handle('settings:backup', () => backupSettingsToFile())
  ipcMain.handle('settings:restore', () => restoreSettingsFromFile())
  ipcMain.handle('settings:reset', () => resetSettings())
}

export function initializeSettings() {
  const settings = getSettings()
  applyStartupSetting(settings.startWithWindows)
  registerGlobalShortcut(settings.globalShortcut)
}
