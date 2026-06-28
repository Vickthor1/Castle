import React, { useState } from 'react';
import Button from '@/components/Button';
import { getElectronApi } from '@/services/electronApi';
import { useSettings } from '@/hooks/useSettings';
import type { AppSettings } from '@/types/settings';

export default function SettingsPage() {
  const { settings, setSettings, saveSettings } = useSettings();
  const [message, setMessage] = useState('');

  const persist = async (next: AppSettings) => {
    await saveSettings(next);
    setMessage('Configurações salvas.');
  };

  const addFolder = async () => {
    const folder = await getElectronApi().pickWindowsFolder();
    if (!folder) return;
    const nextFolders = await getElectronApi().addMonitoredFolder(folder);
    if (nextFolders) {
      setSettings((prev) => ({ ...prev, monitoredFolders: nextFolders }));
      setMessage('Pasta adicionada.');
    }
  };

  const removeFolder = async (folder: string) => {
    const nextFolders = await getElectronApi().removeMonitoredFolder(folder);
    if (nextFolders) {
      setSettings((prev) => ({ ...prev, monitoredFolders: nextFolders }));
      setMessage('Pasta removida.');
    }
  };

  const backup = async () => {
    const path = await getElectronApi().backupSettings();
    setMessage(path ? `Backup salvo em ${path}` : 'Backup cancelado.');
  };

  const restore = async () => {
    const restored = await getElectronApi().restoreSettings();
    if (restored) {
      setSettings(restored);
      setMessage('Configurações restauradas.');
    }
  };

  const reset = async () => {
    const defaults = await getElectronApi().resetSettings();
    if (defaults) {
      setSettings(defaults);
      setMessage('Configurações redefinidas.');
    }
  };

  const quit = async () => {
    await getElectronApi().quitApp();
  };

  return (
    <div className="grid gap-5">
      <div className="ds-card rounded-[8px] p-6">
        <div className="flex flex-col gap-2">
          <p className="eyebrow">Configurações</p>
          <h1 className="text-2xl font-semibold text-white">Personalize o Castle</h1>
          <p className="max-w-2xl text-sm text-white/65">
            Ajuste opções de tema, idioma, pastas monitoradas e comportamento básico do app.
          </p>
        </div>
        {message && (
          <div
            className="mt-4 rounded-[8px] border border-[color:var(--border)] bg-[#0F0F0F] px-4 py-3 text-sm text-white/75"
            role="status"
          >
            {message}
          </div>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="ds-card rounded-[8px] p-6">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm text-white/75">
              <span className="font-semibold text-white">Tema</span>
              <select
                id="theme-select"
                className="ds-select w-full"
                value={settings.theme}
                onChange={(e) =>
                  void persist({ ...settings, theme: e.target.value as AppSettings['theme'] })
                }
              >
                <option value="dark">Escuro</option>
                <option value="light">Claro</option>
                <option value="system">Sistema</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm text-white/75">
              <span className="font-semibold text-white">Idioma</span>
              <select
                id="language-select"
                className="ds-select w-full"
                value={settings.language}
                onChange={(e) =>
                  void persist({ ...settings, language: e.target.value as AppSettings['language'] })
                }
              >
                <option value="pt-BR">Português (BR)</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </label>

            <label className="flex items-center justify-between rounded-[8px] border border-[color:var(--border)] bg-[#0F0F0F] px-4 py-3 text-sm text-white/75">
              <span>Inicializar com Windows</span>
              <input
                id="start-with-windows"
                type="checkbox"
                checked={settings.startWithWindows}
                onChange={(e) => void persist({ ...settings, startWithWindows: e.target.checked })}
              />
            </label>

            <label className="flex items-center justify-between rounded-[8px] border border-[color:var(--border)] bg-[#0F0F0F] px-4 py-3 text-sm text-white/75">
              <span>Salvar automaticamente</span>
              <input
                id="auto-save"
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => void persist({ ...settings, autoSave: e.target.checked })}
              />
            </label>
          </div>
        </div>

        <div className="ds-card rounded-[8px] p-6">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm text-white/75">
              <span className="font-semibold text-white">Atalho global</span>
              <input
                id="global-shortcut"
                className="ds-input w-full"
                value={settings.globalShortcut}
                onChange={(e) => void persist({ ...settings, globalShortcut: e.target.value })}
                placeholder="CommandOrControl+Alt+S"
              />
            </label>

            <div className="grid gap-3">
              <div className="text-sm font-semibold text-white">Pastas monitoradas</div>
              <div className="grid gap-2">
                {settings.monitoredFolders.map((folder) => (
                  <div
                    key={folder}
                    className="flex items-center justify-between rounded-[8px] border border-[color:var(--border)] bg-[#0F0F0F] px-4 py-3 text-sm text-white/75"
                  >
                    <span className="truncate">{folder}</span>
                    <button
                      type="button"
                      className="text-white/60 transition hover:text-white"
                      onClick={() => void removeFolder(folder)}
                      aria-label={`Remover ${folder}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full" onClick={() => void addFolder()}>
                Adicionar pasta
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="ds-card rounded-[8px] p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/60">Gerenciar dados</p>
            <p className="text-xs text-white/50">
              Backup, restauração e redefinição de configurações.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" onClick={() => void backup()}>
              Backup
            </Button>
            <Button variant="ghost" onClick={() => void restore()}>
              Restaurar
            </Button>
            <Button variant="ghost" onClick={() => void reset()}>
              Resetar
            </Button>
            <Button variant="ghost" onClick={() => void quit()}>
              Fechar app
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
