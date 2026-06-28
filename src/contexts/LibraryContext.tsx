import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import type { AppItem, CategoryItem, CollectionItem, LibraryMeta } from '@/types/library';
import {
  scanWindowsApps,
  addWindowsFolder,
  pickWindowsFolder,
} from '@/services/windowsIntegration';
import { getLibraryMeta, setLibraryMeta } from '@/services/libraryStorage';

type LibraryContextValue = {
  items: AppItem[];
  setItems: (v: AppItem[]) => void;
  selectedIds: Set<string>;
  toggleSelect: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  search: string;
  setSearch: (s: string) => void;
  filterCategory: string | null;
  setFilterCategory: (c: string | null) => void;
  sortBy: 'name' | 'category';
  setSortBy: (s: 'name' | 'category') => void;
  meta: LibraryMeta;
  categories: CategoryItem[];
  collections: CollectionItem[];
  tags: Record<string, string[]>;
  setMeta: (v: LibraryMeta) => void;
  refreshApps: () => Promise<void>;
  addFolder: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  togglePinned: (id: string) => void;
  toggleHidden: (id: string) => void;
  openApp: (id: string) => void;
  addCategory: (name: string) => void;
  renameCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  assignCategory: (id: string, categoryId: string | null) => void;
  reorderItems: (sourceId: string, targetId: string) => void;
};

const defaultMeta: LibraryMeta = {
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

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

export function LibraryProvider({ children }: { children?: React.ReactNode }) {
  const [items, setItems] = useState<AppItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'category'>('name');
  const [meta, setMetaState] = useState<LibraryMeta>(defaultMeta);

  const persistMeta = useCallback((next: LibraryMeta) => {
    setMetaState(next);
    void setLibraryMeta(next);
  }, []);

  const refreshApps = useCallback(async () => {
    const data = await scanWindowsApps();
    setItems((prev) =>
      data.map((it) => {
        const previous = prev.find((x) => x.id === it.id);
        const category =
          meta.categories.find((c) => c.items.includes(it.id))?.name ??
          previous?.category ??
          it.category;
        return {
          id: it.id,
          name: it.name,
          description: previous?.description,
          category,
          tags: previous?.tags ?? [],
          source: previous?.source ?? 'program',
          sourceLabel: previous?.sourceLabel ?? 'Programa',
          favorite: meta.favorites.includes(it.id),
          pinned: meta.pinned.includes(it.id),
          hidden: meta.hidden.includes(it.id),
          path: it.path || previous?.path,
          targetPath: it.targetPath || previous?.targetPath,
          executable: it.path,
          sourceType: it.sourceType || previous?.sourceType,
          icon: it.icon || previous?.icon,
          banner: previous?.banner,
          version: previous?.version,
          sizeBytes: previous?.sizeBytes,
          lastLaunchedAt: previous?.lastLaunchedAt,
          firstLaunchedAt: previous?.firstLaunchedAt,
          launchCount: previous?.launchCount ?? 0,
          totalRunSeconds: previous?.totalRunSeconds ?? 0,
          createdAt: previous?.createdAt ?? new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publisher: previous?.publisher,
        };
      }),
    );
  }, [meta.categories, meta.favorites, meta.pinned, meta.hidden]);

  const addFolder = async () => {
    const folder = await pickWindowsFolder();
    if (!folder) return;
    await addWindowsFolder(folder);
    await refreshApps();
  };

  useEffect(() => {
    void (async () => {
      const stored = await getLibraryMeta();
      if (stored) {
        persistMeta(stored);
        const data = await scanWindowsApps();
        setItems(
          data.map((it) => {
            const category = stored.categories.find((c) => c.items.includes(it.id))?.name;
            return {
              ...it,
              favorite: stored.favorites.includes(it.id),
              category,
            } as AppItem;
          }),
        );
      } else {
        await refreshApps();
      }
    })();
  }, [persistMeta, refreshApps]);

  const toggleSelect = (id: string, multi = false) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (!multi) next.clear();
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const clearSelection = () => setSelectedIds(new Set());

  const toggleFavorite = (id: string) => {
    const nextFavorites = meta.favorites.includes(id)
      ? meta.favorites.filter((item) => item !== id)
      : [...meta.favorites, id];
    persistMeta({ ...meta, favorites: nextFavorites });
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item)),
    );
  };

  const togglePinned = (id: string) => {
    const nextPinned = meta.pinned.includes(id)
      ? meta.pinned.filter((item) => item !== id)
      : [...meta.pinned, id];
    persistMeta({ ...meta, pinned: nextPinned });
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item)),
    );
  };

  const toggleHidden = (id: string) => {
    const nextHidden = meta.hidden.includes(id)
      ? meta.hidden.filter((item) => item !== id)
      : [...meta.hidden, id];
    persistMeta({ ...meta, hidden: nextHidden });
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, hidden: !item.hidden } : item)),
    );
  };

  const openApp = (id: string) => {
    const now = new Date().toISOString();
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              lastLaunchedAt: now,
              firstLaunchedAt: item.firstLaunchedAt ?? now,
              launchCount: (item.launchCount || 0) + 1,
            }
          : item,
      ),
    );

    const nextMeta = {
      ...meta,
      recent: [id, ...meta.recent.filter((item) => item !== id)].slice(0, 8),
      usage: { ...meta.usage, [id]: (meta.usage[id] || 0) + 1 },
      history: [id, ...meta.history.filter((item) => item !== id)].slice(0, 20),
    };
    persistMeta(nextMeta);
  };

  const addCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const nextMeta = {
      ...meta,
      categories: [...meta.categories, { id: `cat-${Date.now()}`, name: trimmed, items: [] }],
    };
    persistMeta(nextMeta);
  };

  const renameCategory = (id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const nextMeta = {
      ...meta,
      categories: meta.categories.map((category) =>
        category.id === id ? { ...category, name: trimmed } : category,
      ),
    };
    persistMeta(nextMeta);
    setItems((prev) =>
      prev.map((item) =>
        item.category && meta.categories.find((c) => c.id === id)?.name === item.category
          ? { ...item, category: trimmed }
          : item,
      ),
    );
  };

  const deleteCategory = (id: string) => {
    const nextMeta = {
      ...meta,
      categories: meta.categories.filter((category) => category.id !== id),
    };
    persistMeta(nextMeta);
    setItems((prev) =>
      prev.map((item) =>
        item.category === meta.categories.find((c) => c.id === id)?.name
          ? { ...item, category: undefined }
          : item,
      ),
    );
  };

  const assignCategory = (id: string, categoryId: string | null) => {
    const category = meta.categories.find((c) => c.id === categoryId);
    const nextCategories = meta.categories.map((entry) => ({
      ...entry,
      items: entry.items.filter((itemId) => itemId !== id),
    }));
    if (category) {
      nextCategories.find((entry) => entry.id === category.id)?.items.push(id);
    }
    const nextMeta = { ...meta, categories: nextCategories };
    persistMeta(nextMeta);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, category: category?.name } : item)),
    );
  };

  const reorderItems = (sourceId: string, targetId: string) => {
    const nextOrdering = [...meta.ordering.filter((item) => item !== sourceId)];
    const targetIndex = nextOrdering.indexOf(targetId);
    nextOrdering.splice(targetIndex >= 0 ? targetIndex : nextOrdering.length, 0, sourceId);
    persistMeta({ ...meta, ordering: nextOrdering });
    setItems((prev) => {
      const ordered = [...prev];
      const sourceIndex = ordered.findIndex((item) => item.id === sourceId);
      const targetIndexValue = ordered.findIndex((item) => item.id === targetId);
      if (sourceIndex < 0 || targetIndexValue < 0) return ordered;
      const [moved] = ordered.splice(sourceIndex, 1);
      ordered.splice(targetIndexValue, 0, moved);
      return ordered;
    });
  };

  const value = useMemo(
    () => ({
      items,
      setItems,
      selectedIds,
      toggleSelect,
      clearSelection,
      search,
      setSearch,
      filterCategory,
      setFilterCategory,
      sortBy,
      setSortBy,
      meta,
      setMeta: persistMeta,
      refreshApps,
      addFolder,
      toggleFavorite,
      openApp,
      addCategory,
      renameCategory,
      deleteCategory,
      assignCategory,
      reorderItems,
    }),
    [
      addCategory,
      assignCategory,
      clearSelection,
      deleteCategory,
      filterCategory,
      items,
      meta,
      openApp,
      persistMeta,
      refreshApps,
      reorderItems,
      renameCategory,
      search,
      selectedIds,
      setItems,
      sortBy,
      toggleFavorite,
      toggleSelect,
    ],
  );

  return (
    <LibraryContext.Provider value={value as LibraryContextValue}>
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider');
  return ctx;
};
