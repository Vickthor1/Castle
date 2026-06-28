export type WindowsScanResult = {
  id: string
  name: string
  category: string
  path: string
  targetPath?: string
  sourceType: 'exe' | 'lnk'
  favorite?: boolean
  icon?: string
}

export async function scanWindowsApps(): Promise<WindowsScanResult[]> {
  return (await window.electron?.scanWindowsApps?.()) ?? []
}

export async function pickWindowsFolder(): Promise<string | null> {
  return (await window.electron?.pickWindowsFolder?.()) ?? null
}

export async function addWindowsFolder(folder: string): Promise<string[]> {
  return (await window.electron?.addWindowsFolder?.(folder)) ?? []
}
