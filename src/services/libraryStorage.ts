import { getElectronApi } from '@/services/electronApi'

export type LibraryMeta = {
  favorites: string[]
  categories: Array<{ id: string; name: string; items: string[] }>
  recent: string[]
  usage: Record<string, number>
  history: string[]
  ordering: string[]
}

export async function getLibraryMeta(): Promise<LibraryMeta> {
  const meta = (await getElectronApi().getLibraryMeta()) as LibraryMeta | null
  return meta ?? {
    favorites: [],
    categories: [],
    recent: [],
    usage: {},
    history: [],
    ordering: []
  }
}

export async function setLibraryMeta(meta: LibraryMeta) {
  return getElectronApi().setLibraryMeta(meta)
}
