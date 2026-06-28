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

  return (
    <div className="flex flex-col gap-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[220px]">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="ghost" onClick={() => void refreshApps()}>Atualizar</Button>
        <Button variant="ghost" onClick={() => void addFolder()}>Adicionar pasta</Button>
        <select className="ds-input w-44" value={filterCategory || ''} onChange={(e) => setFilterCategory(e.target.value || null)}>
          <option value="">Todos</option>
          {meta.categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <select className="ds-input w-44" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
          <option value="name">Ordenar por nome</option>
          <option value="category">Ordenar por categoria</option>
        </select>
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
        <div className="flex-1 min-w-[220px] flex gap-2">
          <input className="ds-input flex-1" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Nova categoria" />
          <Button variant="ghost" onClick={() => { addCategory(categoryName); setCategoryName('') }}>
            Criar
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: 0.08 }} className="flex flex-wrap gap-2">
        {meta.categories.map((category) => (
          <div key={category.id} className="flex items-center gap-2 rounded-full border border-white/10 bg-[color:var(--surface-2)] px-3 py-1 text-sm">
            <span>{category.name}</span>
            <button className="text-white/60 hover:text-white" onClick={() => renameCategory(category.id, prompt('Renomear categoria', category.name) || category.name)}>
              ✎
            </button>
            <button className="text-white/60 hover:text-white" onClick={() => deleteCategory(category.id)}>
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
