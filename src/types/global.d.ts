declare global {
  interface Window {
    electron?: {
      send: (channel: string, data?: any) => void
      receive: (channel: string, cb: (...args: any[]) => void) => void
      scanWindowsApps: () => Promise<any[]>
      addWindowsFolder: (folder: string) => Promise<string[]>
      pickWindowsFolder: () => Promise<string | null>
      launchApp: (item: any) => Promise<any>
      getLibraryMeta: () => Promise<any>
      setLibraryMeta: (meta: any) => Promise<any>
      getSettings: () => Promise<any>
      setSettings: (settings: any) => Promise<any>
      addMonitoredFolder: (folder: string) => Promise<string[]>
      removeMonitoredFolder: (folder: string) => Promise<string[]>
      backupSettings: () => Promise<string | null>
      restoreSettings: () => Promise<any>
      resetSettings: () => Promise<any>
      showTrayWindow: () => Promise<any>
      hideTrayWindow: () => Promise<any>
      quitApp: () => Promise<any>
    }
  }
}

export {}
