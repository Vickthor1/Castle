import { getElectronApi } from '@/services/electronApi'

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
  return (await getElectronApi().scanWindowsApps()) as WindowsScanResult[]
}

export async function pickWindowsFolder(): Promise<string | null> {
  return (await getElectronApi().pickWindowsFolder()) ?? null
}

export async function addWindowsFolder(folder: string): Promise<string[]> {
  return (await getElectronApi().addWindowsFolder(folder)) ?? []
}
