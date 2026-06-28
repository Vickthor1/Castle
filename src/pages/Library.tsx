import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useLibrary } from '@/contexts/LibraryContext'
import LibraryGrid from '@/components/LibraryGrid'
import SearchBar from '@/components/SearchBar'
import Button from '@/components/Button'

export default function LibraryPage() {
  const { items, search, setSearch, filterCategory, setFilterCategory, sortBy, setSortBy, refreshApps, addFolder, meta, toggleFavorite, openApp, addCategory, renameCategory, deleteCategory, assignCategory, reorderItems } = useLibrary()
  const [categoryName, setCategoryName] = useState('')

  const filtered = useMemo(() => {
    let res = items.slice()
    if (search) {
      const s = search.toLowerCase()
      res = res.filter((it) => it.name.toLowerCase().includes(s) || (it.category || '').toLowerCase().includes(s))
    }
    if (filterCategory) res = res.filter((it) => it.category === filterCategory)
    if (sortBy === 'name') res.sort((a, b) => a.name.localeCompare(b.name))
    else res.sort((a, b) => (a.category || '').localeCompare(b.category || ''))
    return res
  }, [items, search, filterCategory, sortBy])

  const handleRenameCategory = (id: string, currentName: string) => {
    const nextName = window.prompt('Renomear categoria', currentName)
    if (nextName) {
      renameCategory(id, nextName)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex flex-wrap items-center gap-3">
        <div className="min-w-[220px] flex-1">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="ghost" onClick={() => void refreshApps()}>Atualizar</Button>
        <Button variant="ghost" onClick={() => void addFolder()}>Adicionar pasta</Button>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <span className="hidden sm:inline">Categoria</span>
          <select className="ds-input w-44" value={filterCategory || ''} onChange={(e) => setFilterCategory(e.target.value || null)}>
            <option value="">Todos</option>
            {meta.categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <span className="hidden sm:inline">Ordenar</span>
          <select className="ds-input w-44" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'name' | 'category')}>
            <option value="name">Ordenar por nome</option>
            <option value="category">Ordenar por categoria</option>
          </select>
        </label>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: 0.05 }} className="flex flex-wrap gap-3 rounded-lg border border-white/10 bg-[color:var(--surface-2)] p-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/70">Favoritos:</span>
          <strong>{meta.favorites.length}</strong>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/70">Recentes:</span>
          <strong>{meta.recent.length}</strong>
        </div>
        <div className="flex min-w-[220px] flex-1 gap-2">
          <input className="ds-input flex-1" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Nova categoria" aria-label="Nova categoria" />
          <Button variant="ghost" onClick={() => { addCategory(categoryName); setCategoryName('') }}>
            Criar
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: 0.08 }} className="flex flex-wrap gap-2">
        {meta.categories.map((category) => (
          <div key={category.id} className="flex items-center gap-2 rounded-full border border-white/10 bg-[color:var(--surface-2)] px-3 py-1 text-sm">
            <span>{category.name}</span>
            <button type="button" className="text-white/60 transition-colors hover:text-white" onClick={() => handleRenameCategory(category.id, category.name)} aria-label={`Renomear ${category.name}`}>
              ✎
            </button>
            <button type="button" className="text-white/60 transition-colors hover:text-white" onClick={() => deleteCategory(category.id)} aria-label={`Excluir ${category.name}`}>
              ×
            </button>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} style={{ height: 'calc(100vh - 320px)' }} className="w-full">
        <LibraryGrid
          items={filtered}
          categories={meta.categories}
          onToggleFavorite={(item) => toggleFavorite(item.id)}
          onOpen={async (item) => {
            openApp(item.id)
            const result = await window.electron?.launchApp?.({
              id: item.id,
              name: item.name,
              path: item.path,
              targetPath: item.path,
              sourceType: item.sourceType
            })
            if (result && !result.ok) {
              window.alert(result.message)
            }
          }}
          onAssignCategory={(item, categoryId) => assignCategory(item.id, categoryId)}
          onReorder={(sourceId, targetId) => reorderItems(sourceId, targetId)}
        />
      </motion.div>
    </div>
  )
}
