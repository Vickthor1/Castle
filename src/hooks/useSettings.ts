import { useCallback, useEffect, useState } from 'react'
import { getElectronApi } from '@/services/electronApi'
import type { AppSettings } from '@/types/settings'

const defaultSettings: AppSettings = {
  theme: 'dark',
  language: 'pt-BR',
  startWithWindows: false,
  monitoredFolders: [],
  globalShortcut: 'Control+Space',
  autoSave: true
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      const current = await getElectronApi().getSettings()
      if (current) setSettings(current)
      setLoading(false)
    })()
  }, [])

  const saveSettings = useCallback(async (next: AppSettings) => {
    setSettings(next)
    if (next.autoSave) {
      await getElectronApi().setSettings(next)
    }
  }, [])

  return { settings, loading, setSettings, saveSettings }
}
