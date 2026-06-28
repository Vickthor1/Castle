import React, { useState } from 'react'
import Button from '@/components/Button'
import AnimatedSurface from '@/components/AnimatedSurface'
import { getElectronApi } from '@/services/electronApi'
import { useSettings } from '@/hooks/useSettings'
import type { AppSettings } from '@/types/settings'

export default function SettingsPage() {
  const { settings, setSettings, saveSettings } = useSettings()
  const [message, setMessage] = useState('')

  const persist = async (next: AppSettings) => {
    await saveSettings(next)
    setMessage('Configurações salvas automaticamente.')
  }

  const addFolder = async () => {
    const folder = await getElectronApi().pickWindowsFolder()
    if (!folder) return
    const nextFolders = await getElectronApi().addMonitoredFolder(folder)
    if (nextFolders) {
      setSettings((prev) => ({ ...prev, monitoredFolders: nextFolders }))
      setMessage('Pasta adicionada às monitoradas.')
    }
  }

  const removeFolder = async (folder: string) => {
    const nextFolders = await getElectronApi().removeMonitoredFolder(folder)
    if (nextFolders) {
      setSettings((prev) => ({ ...prev, monitoredFolders: nextFolders }))
      setMessage('Pasta removida das monitoradas.')
    }
  }

  const backup = async () => {
    const path = await getElectronApi().backupSettings()
    setMessage(path ? `Backup salvo em ${path}` : 'Backup cancelado.')
  }

  const restore = async () => {
    const restored = await getElectronApi().restoreSettings()
    if (restored) {
      setSettings(restored)
      setMessage('Configurações restauradas.')
    }
  }

  const reset = async () => {
    const defaults = await getElectronApi().resetSettings()
    if (defaults) {
      setSettings(defaults)
      setMessage('Configurações redefinidas.')
    }
  }

  const quit = async () => {
    await getElectronApi().quitApp()
  }

  return (
    <div className="flex flex-col gap-4">
      <AnimatedSurface className="ds-card flex flex-col gap-2">
        <div className="text-lg font-semibold">Configurações</div>
        <p className="text-sm text-white/60">Tudo é salvo automaticamente no Electron Store.</p>
        {message && <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm">{message}</div>}
      </AnimatedSurface>

      <div className="grid gap-4 xl:grid-cols-2">
        <AnimatedSurface className="ds-card flex flex-col gap-4">
          <div>
            <div className="text-sm font-semibold">Tema</div>
            <select className="ds-input mt-2 w-full" value={settings.theme} onChange={(e) => void persist({ ...settings, theme: e.target.value as any })}>
              <option value="dark">Escuro</option>
              <option value="light">Claro</option>
              <option value="system">Sistema</option>
            </select>
          </div>

          <div>
            <div className="text-sm font-semibold">Idioma</div>
            <select className="ds-input mt-2 w-full" value={settings.language} onChange={(e) => void persist({ ...settings, language: e.target.value as any })}>
              <option value="pt-BR">Português (BR)</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <span>Inicializar com Windows</span>
            <input type="checkbox" checked={settings.startWithWindows} onChange={(e) => void persist({ ...settings, startWithWindows: e.target.checked })} />
          </label>

          <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <span>Salvar automaticamente</span>
            <input type="checkbox" checked={settings.autoSave} onChange={(e) => void persist({ ...settings, autoSave: e.target.checked })} />
          </label>
        </AnimatedSurface>

        <AnimatedSurface className="ds-card flex flex-col gap-4">
          <div>
            <div className="text-sm font-semibold">Atalho global</div>
            <input className="ds-input mt-2 w-full" value={settings.globalShortcut} onChange={(e) => void persist({ ...settings, globalShortcut: e.target.value })} placeholder="CommandOrControl+Alt+S" />
          </div>

          <div>
            <div className="text-sm font-semibold">Pastas monitoradas</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {settings.monitoredFolders.map((folder) => (
                <div key={folder} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
                  {folder}
                  <button className="ml-2 text-white/60" onClick={() => void removeFolder(folder)}>×</button>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="mt-3" onClick={() => void addFolder()}>Adicionar pasta</Button>
          </div>
        </AnimatedSurface>
      </div>

      <AnimatedSurface className="ds-card flex flex-wrap gap-3">
        <Button variant="ghost" onClick={() => void backup()}>Backup</Button>
        <Button variant="ghost" onClick={() => void restore()}>Restaurar</Button>
        <Button variant="ghost" onClick={() => void reset()}>Resetar configurações</Button>
        <Button variant="ghost" onClick={() => void quit()}>Sair completamente</Button>
      </AnimatedSurface>
    </div>
  )
}
