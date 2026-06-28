import { autoUpdater } from 'electron-updater'

export function setupAutoUpdater() {
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.checkForUpdatesAndNotify().catch(() => {
    // ignore updater errors in development or offline environments
  })
}
