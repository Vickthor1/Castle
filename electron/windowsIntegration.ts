import { app, ipcMain, dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import Store from 'electron-store'

const store = new Store({ name: 'castle-windows-cache' })

const DEFAULT_FOLDERS = [
  process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'Desktop') : '',
  process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs') : '',
  process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'AppData', 'Local', 'Microsoft', 'WindowsApps') : '',
  process.env['PROGRAMFILES'] || '',
  process.env['PROGRAMFILES(X86)'] || '',
]

const CACHE_KEY = 'windowsAppsCache'
const FOLDERS_KEY = 'windowsScanFolders'
const MANUAL_PATHS_KEY = 'windowsManualPaths'

type ScanEntry = {
  id: string
  name: string
  category: string
  path: string
  targetPath?: string
  sourceType: 'exe' | 'lnk'
  favorite?: boolean
  icon?: string
}

type LaunchItem = {
  id: string
  name: string
  path?: string
  targetPath?: string
  sourceType?: 'exe' | 'lnk'
}

type LaunchResult = {
  ok: boolean
  message: string
  path?: string
  status: 'launched' | 'cancelled' | 'missing' | 'error'
}

class AppLaunchError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message)
    this.name = 'AppLaunchError'
  }
}

function normalizePath(p: string) {
  return p.replace(/\\/g, '/')
}

function safeReadFile(file: string) {
  try { return fs.readFileSync(file, 'utf8') } catch { return null }
}

function resolveShortcutTarget(targetPath: string): string | null {
  const content = safeReadFile(targetPath)
  if (!content) return null
  const match = content.match(/TargetPath=(.+)/i)
  if (match?.[1]) return match[1].replace(/\r/g, '').trim().replace(/^"|"$/g, '')
  return null
}

function getPreferredPath(id: string): string | undefined {
  const paths = (store.get(MANUAL_PATHS_KEY) as Record<string, string> | undefined) || {}
  return paths[id]
}

function savePreferredPath(id: string, newPath: string) {
  const paths = (store.get(MANUAL_PATHS_KEY) as Record<string, string> | undefined) || {}
  paths[id] = newPath
  store.set(MANUAL_PATHS_KEY, paths)
}

function resolveAbsolutePath(candidate: string | undefined, fallbackDir?: string): string | undefined {
  if (!candidate) return undefined
  if (path.isAbsolute(candidate)) return candidate
  if (fallbackDir) return path.resolve(fallbackDir, candidate)
  return undefined
}

function candidatePaths(item: LaunchItem): string[] {
  const paths: string[] = []
  const directCandidates = [item.path, item.targetPath, getPreferredPath(item.id)]
  for (const candidate of directCandidates) {
    if (!candidate) continue
    paths.push(candidate)
    const resolved = resolveAbsolutePath(candidate, item.path ? path.dirname(item.path) : undefined)
    if (resolved && resolved !== candidate) paths.push(resolved)
  }
  return Array.from(new Set(paths))
}

function launchExecutable(targetPath: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(targetPath, { detached: true, stdio: 'ignore' })
    child.once('error', reject)
    child.once('spawn', () => {
      child.unref()
      resolve()
    })
  })
}

async function resolveLaunchTarget(item: LaunchItem): Promise<string> {
  const candidates = candidatePaths(item)
  if (item.sourceType === 'lnk') {
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        const resolvedTarget = resolveShortcutTarget(candidate)
        if (resolvedTarget) {
          const resolvedTargetPath = resolveAbsolutePath(resolvedTarget, path.dirname(candidate))
          if (resolvedTargetPath && fs.existsSync(resolvedTargetPath)) return resolvedTargetPath
        }
        if (path.extname(candidate).toLowerCase() === '.exe' && fs.existsSync(candidate)) return candidate
      }
    }
    throw new AppLaunchError(`O atalho para "${item.name}" não aponta para um executável válido.`, 'shortcut-missing')
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate
  }

  throw new AppLaunchError(`O executável para "${item.name}" não foi encontrado.`, 'missing-file')
}

async function pickReplacementPath(item: LaunchItem): Promise<string | null> {
  const result = await dialog.showOpenDialog({
    title: `Selecionar novo caminho para ${item.name}`,
    properties: ['openFile'],
    filters: [{ name: 'Executáveis', extensions: ['exe', 'lnk', 'bat', 'cmd'] }]
  })
  if (result.canceled || !result.filePaths?.[0]) return null
  return result.filePaths[0]
}

async function handleLaunchFailure(item: LaunchItem, error: unknown): Promise<LaunchResult> {
  if (error instanceof AppLaunchError && (error.code === 'missing-file' || error.code === 'shortcut-missing')) {
    const choice = await dialog.showMessageBox({
      type: 'warning',
      title: 'Aplicativo não encontrado',
      message: `O aplicativo "${item.name}" não existe mais no caminho configurado ou o atalho está inválido.`,
      detail: 'Você pode selecionar um novo executável para este item.',
      buttons: ['Escolher novo caminho', 'Cancelar']
    })
    if (choice.response === 0) {
      const replacementPath = await pickReplacementPath(item)
      if (replacementPath) {
        savePreferredPath(item.id, replacementPath)
        return { ok: true, message: 'Caminho atualizado com sucesso.', path: replacementPath, status: 'launched' }
      }
      return { ok: false, message: 'Nenhum novo caminho foi selecionado.', status: 'cancelled' }
    }
    return { ok: false, message: 'Execução cancelada pelo usuário.', status: 'cancelled' }
  }

  const message = error instanceof Error ? error.message : 'Erro desconhecido ao executar o aplicativo.'
  await dialog.showErrorBox('Erro ao abrir aplicativo', message)
  return { ok: false, message, status: 'error' }
}

async function launchApp(item: LaunchItem): Promise<LaunchResult> {
  try {
    const targetPath = await resolveLaunchTarget(item)
    await launchExecutable(targetPath)
    return { ok: true, message: 'Aplicativo iniciado com sucesso.', path: targetPath, status: 'launched' }
  } catch (error) {
    return handleLaunchFailure(item, error)
  }
}

function getBaseName(file: string) {
  return path.basename(file, path.extname(file))
}

function getCategoryFromPath(p: string) {
  const lower = p.toLowerCase()
  if (lower.includes('program files')) return 'Program Files'
  if (lower.includes('appdata')) return 'AppData'
  if (lower.includes('desktop')) return 'Desktop'
  if (lower.includes('start menu')) return 'Menu Iniciar'
  return 'Local'
}

function isExecutable(filePath: string) {
  const ext = path.extname(filePath).toLowerCase()
  return ext === '.exe' || ext === '.lnk'
}

function isDirectory(p: string) {
  return fs.existsSync(p) && fs.statSync(p).isDirectory()
}

function walkDirectory(dir: string, results: ScanEntry[], visited: Set<string>) {
  if (!dir || visited.has(dir)) return
  visited.add(dir)
  if (!isDirectory(dir)) return

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDirectory(full, results, visited)
      continue
    }

    if (!isExecutable(full)) continue

    const relName = getBaseName(entry.name)
    const category = getCategoryFromPath(full)
    const sourceType = path.extname(full).toLowerCase() === '.lnk' ? 'lnk' : 'exe'

    let targetPath: string | undefined
    let resolvedPath = full

    if (sourceType === 'lnk') {
      const shortcutTarget = resolveShortcutTarget(full)
      if (shortcutTarget) {
        targetPath = shortcutTarget
        const candidate = path.isAbsolute(shortcutTarget) ? shortcutTarget : path.join(path.dirname(full), shortcutTarget)
        if (fs.existsSync(candidate)) resolvedPath = candidate
      }
    }

    if (!fs.existsSync(resolvedPath) && sourceType === 'exe') continue

    const entryData: ScanEntry = {
      id: normalizePath(full),
      name: relName,
      category,
      path: normalizePath(full),
      targetPath: targetPath ? normalizePath(targetPath) : undefined,
      sourceType,
      favorite: false,
      icon: undefined,
    }

    results.push(entryData)
  }
}

function extractIconBase64(filePath: string): string | undefined {
  try {
    const iconPath = path.join(path.dirname(filePath), `${path.basename(filePath, path.extname(filePath))}.ico`)
    if (fs.existsSync(iconPath)) {
      const data = fs.readFileSync(iconPath)
      return `data:image/x-icon;base64,${data.toString('base64')}`
    }
  } catch {}
  return undefined
}

async function scanAndProcess(targetFolders: string[]): Promise<ScanEntry[]> {
  const results: ScanEntry[] = []
  const visited = new Set<string>()
  for (const folder of targetFolders) {
    if (folder && isDirectory(folder)) walkDirectory(folder, results, visited)
  }

  const withIcons = results.map((entry) => ({ ...entry, icon: extractIconBase64(entry.path) }))
  store.set(CACHE_KEY, withIcons)
  return withIcons
}

export async function getWindowsApps() {
  const cached = store.get(CACHE_KEY) as ScanEntry[] | undefined
  if (cached?.length) return cached
  const folders = (store.get(FOLDERS_KEY) as string[] | undefined) || DEFAULT_FOLDERS.filter(Boolean)
  return scanAndProcess(folders)
}

export async function addWindowsFolder(folder: string) {
  const folders = (store.get(FOLDERS_KEY) as string[] | undefined) || []
  if (!folders.includes(folder)) folders.push(folder)
  store.set(FOLDERS_KEY, folders)
  return folders
}

export async function pickWindowsFolder() {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (result.canceled || !result.filePaths?.[0]) return null
  return result.filePaths[0]
}

ipcMain.handle('windows:scanApps', async () => {
  const folders = (store.get(FOLDERS_KEY) as string[] | undefined) || DEFAULT_FOLDERS.filter(Boolean)
  const data = await scanAndProcess(folders)
  return data
})

ipcMain.handle('windows:addFolder', async (_event, folder: string) => {
  return addWindowsFolder(folder)
})

ipcMain.handle('windows:pickFolder', async () => pickWindowsFolder())

ipcMain.handle('windows:launchApp', async (_event, item: LaunchItem) => launchApp(item))
