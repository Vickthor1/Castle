import type { AppSettings } from '@/types/settings'

export interface ElectronApi {
  send: (channel: string, data?: unknown) => void
  receive: (channel: string, cb: (...args: unknown[]) => void) => void
  scanWindowsApps: () => Promise<unknown[]>
  addWindowsFolder: (folder: string) => Promise<string[]>
  pickWindowsFolder: () => Promise<string | null>
  launchApp: (item: unknown) => Promise<unknown>
  getLibraryMeta: () => Promise<unknown>
  setLibraryMeta: (meta: unknown) => Promise<unknown>
  getSettings: () => Promise<AppSettings | null>
  setSettings: (settings: AppSettings) => Promise<AppSettings>
  addMonitoredFolder: (folder: string) => Promise<string[]>
  removeMonitoredFolder: (folder: string) => Promise<string[]>
  backupSettings: () => Promise<string | null>
  restoreSettings: () => Promise<AppSettings | null>
  resetSettings: () => Promise<AppSettings | null>
  showTrayWindow: () => Promise<unknown>
  hideTrayWindow: () => Promise<unknown>
  quitApp: () => Promise<unknown>
}
