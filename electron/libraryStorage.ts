import { ipcMain } from 'electron'
import ElectronStore from 'electron-store'

export type LibraryMeta = {
  favorites: string[]
  categories: Array<{ id: string; name: string; items: string[] }>
  recent: string[]
  usage: Record<string, number>
  history: string[]
  ordering: string[]
}

const store = new ElectronStore<{ libraryMeta: LibraryMeta }>({
  name: 'castle-library'
})

const defaults: LibraryMeta = {
  favorites: [],
  categories: [],
  recent: [],
  usage: {},
  history: [],
  ordering: []
}

export function getLibraryMeta(): LibraryMeta {
  return (store.get('libraryMeta') as LibraryMeta) ?? defaults
}

export function setLibraryMeta(meta: LibraryMeta): LibraryMeta {
  store.set('libraryMeta', meta)
  return meta
}

export function registerLibraryStorageHandlers() {
  ipcMain.handle('library:getMeta', () => getLibraryMeta())

  ipcMain.handle('library:setMeta', (_event: any, meta: LibraryMeta) => {
    return setLibraryMeta(meta)
  })
}