export type AppSettings = {
  theme: 'dark' | 'light' | 'system'
  language: 'pt-BR' | 'en' | 'es'
  startWithWindows: boolean
  monitoredFolders: string[]
  globalShortcut: string
  autoSave: boolean
}
