export type LibraryMeta = {
  favorites: string[]
  categories: Array<{ id: string; name: string; items: string[] }>
  recent: string[]
  usage: Record<string, number>
  history: string[]
  ordering: string[]
}

export async function getLibraryMeta(): Promise<LibraryMeta> {
  return (await window.electron?.getLibraryMeta?.()) || {
    favorites: [],
    categories: [],
    recent: [],
    usage: {},
    history: [],
    ordering: []
  }
}

export async function setLibraryMeta(meta: LibraryMeta) {
  return window.electron?.setLibraryMeta?.(meta)
}
