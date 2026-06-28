import type { ElectronApi } from '@/types/electron'

declare global {
  interface Window {
    electron?: ElectronApi
  }
}

export {}
