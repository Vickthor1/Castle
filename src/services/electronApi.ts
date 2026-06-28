import type { ElectronApi } from '@/types/electron'

export function getElectronApi(): ElectronApi {
  if (!window.electron) {
    throw new Error('Electron API is unavailable in the renderer process.')
  }
  return window.electron
}
