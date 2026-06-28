import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  send: (channel: string, data: any) => ipcRenderer.send(channel, data),
  receive: (channel: string, func: (...args: any[]) => void) => ipcRenderer.on(channel, (_event: any, ...args: any[]) => func(...args)),
  scanWindowsApps: () => ipcRenderer.invoke('windows:scanApps'),
  addWindowsFolder: (folder: string) => ipcRenderer.invoke('windows:addFolder', folder),
  pickWindowsFolder: () => ipcRenderer.invoke('windows:pickFolder'),
  launchApp: (item: any) => ipcRenderer.invoke('windows:launchApp', item),
  getLibraryMeta: () => ipcRenderer.invoke('library:getMeta'),
  setLibraryMeta: (meta: any) => ipcRenderer.invoke('library:setMeta', meta),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  setSettings: (settings: any) => ipcRenderer.invoke('settings:set', settings),
  addMonitoredFolder: (folder: string) => ipcRenderer.invoke('settings:addFolder', folder),
  removeMonitoredFolder: (folder: string) => ipcRenderer.invoke('settings:removeFolder', folder),
  backupSettings: () => ipcRenderer.invoke('settings:backup'),
  restoreSettings: () => ipcRenderer.invoke('settings:restore'),
  resetSettings: () => ipcRenderer.invoke('settings:reset'),
  showTrayWindow: () => ipcRenderer.invoke('tray:show'),
  hideTrayWindow: () => ipcRenderer.invoke('tray:hide'),
  quitApp: () => ipcRenderer.invoke('tray:quit')
})
