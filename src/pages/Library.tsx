import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLibrary } from '@/contexts/LibraryContext';
import LibraryGrid from '@/components/LibraryGrid';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';

export default function LibraryPage() {
  const {
    items,
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    sortBy,
    setSortBy,
    refreshApps,
    addFolder,
    meta,
    toggleFavorite,
    openApp,
    addCategory,
    renameCategory,
    deleteCategory,
    assignCategory,
    reorderItems,
  } = useLibrary();
  const [categoryName, setCategoryName] = useState('');

  const filtered = useMemo(() => {
    let res = items.slice();
    if (search) {
      const s = search.toLowerCase();
      res = res.filter(
        (it) => it.name.toLowerCase().includes(s) || (it.category || '').toLowerCase().includes(s),
      );
    }
    if (filterCategory) res = res.filter((it) => it.category === filterCategory);
    if (sortBy === 'name') res.sort((a, b) => a.name.localeCompare(b.name));
    else res.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
    return res;
  }, [items, search, filterCategory, sortBy]);

  const handleRenameCategory = (id: string, currentName: string) => {
    const nextName = window.prompt('Renomear categoria', currentName);
    if (nextName) {
      renameCategory(id, nextName);
    }
  };

  return (
    <div className="grid gap-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="grid gap-4 lg:grid-cols-[1.6fr_1fr]"
      >
        <div className="ds-card flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Biblioteca</p>
              <h1 className="text-2xl font-semibold text-white">Gerencie seus jogos e apps</h1>
            </div>
            <div className="rounded-[8px] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/50">
              {filtered.length} itens
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[8px] border border-[color:var(--border)] bg-[#0F0F0F] p-4">
              <p className="text-sm text-white/60">Favoritos</p>
              <p className="mt-2 text-3xl font-semibold text-white">{meta.favorites.length}</p>
            </div>
            <div className="rounded-[8px] border border-[color:var(--border)] bg-[#0F0F0F] p-4">
              <p className="text-sm text-white/60">Recentes</p>
              <p className="mt-2 text-3xl font-semibold text-white">{meta.recent.length}</p>
            </div>
            <div className="rounded-[8px] border border-[color:var(--border)] bg-[#0F0F0F] p-4">
              <p className="text-sm text-white/60">Categorias</p>
              <p className="mt-2 text-3xl font-semibold text-white">{meta.categories.length}</p>
            </div>
          </div>
        </div>

        <div className="ds-card flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-white/60">Ações rápidas</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="ghost" onClick={() => void refreshApps()}>
                Atualizar biblioteca
              </Button>
              <Button variant="ghost" onClick={() => void addFolder()}>
                Adicionar pasta
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-white/70">
                <span>Filtrar categoria</span>
                <select
                  className="ds-select w-full"
                  value={filterCategory || ''}
                  onChange={(e) => setFilterCategory(e.target.value || null)}
                >
                  <option value="">Todos</option>
                  {meta.categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                <span>Ordenar</span>
                <select
                  className="ds-select w-full"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'category')}
                >
                  <option value="name">Nome</option>
                  <option value="category">Categoria</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.05 }}
        className="ds-card grid gap-3"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-white/60">Categorias ativas</p>
            <p className="text-base text-white/80">
              Toque em uma categoria para renomear ou remover.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="ds-input rounded-[8px] bg-[#0F0F0F] px-4 py-3 text-white"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Nova categoria"
              aria-label="Nova categoria"
            />
            <Button
              variant="ghost"
              onClick={() => {
                addCategory(categoryName);
                setCategoryName('');
              }}
            >
              Criar
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {meta.categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-2 rounded-[8px] border border-[color:var(--border)] bg-[#0F0F0F] px-4 py-2 text-sm transition hover:border-red-500/30"
            >
              <span>{category.name}</span>
              <button
                type="button"
                className="text-white/50 transition hover:text-white"
                onClick={() => handleRenameCategory(category.id, category.name)}
                aria-label={`Renomear ${category.name}`}
              >
                ✎
              </button>
              <button
                type="button"
                className="text-white/50 transition hover:text-white"
                onClick={() => deleteCategory(category.id)}
                aria-label={`Excluir ${category.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{ height: 'calc(100vh - 330px)' }}
        className="w-full rounded-[8px] border border-[color:var(--border)] bg-[#0F0F0F] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      >
        <LibraryGrid
          items={filtered}
          categories={meta.categories}
          onToggleFavorite={(item) => toggleFavorite(item.id)}
          onOpen={async (item) => {
            openApp(item.id);
            const result = await window.electron?.launchApp?.({
              id: item.id,
              name: item.name,
              path: item.path,
              targetPath: item.path,
              sourceType: item.sourceType,
            });
            if (result && !result.ok) {
              window.alert(result.message);
            }
          }}
          onAssignCategory={(item, categoryId) => assignCategory(item.id, categoryId)}
          onReorder={(sourceId, targetId) => reorderItems(sourceId, targetId)}
        />
      </motion.div>
    </div>
  );
}
