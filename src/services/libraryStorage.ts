import { getElectronApi } from '@/services/electronApi';
import type { LibraryMeta } from '@/types/library';

const defaultLibraryMeta: LibraryMeta = {
  favorites: [],
  pinned: [],
  hidden: [],
  categories: [],
  collections: [],
  tags: {},
  recent: [],
  usage: {},
  history: [],
  ordering: [],
};

export async function getLibraryMeta(): Promise<LibraryMeta> {
  const meta = (await getElectronApi().getLibraryMeta()) as LibraryMeta | null;
  return meta ?? defaultLibraryMeta;
}

export async function setLibraryMeta(meta: LibraryMeta) {
  return getElectronApi().setLibraryMeta(meta);
}
