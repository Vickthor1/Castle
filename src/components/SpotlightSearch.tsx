import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, X } from 'lucide-react'
import { useFuzzySearch } from '@/hooks/useFuzzySearch'
import { useLibrary } from '@/contexts/LibraryContext'
import type { AppItem } from '@/types/library'

export default function SpotlightSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { items } = useLibrary()

  const filtered = useFuzzySearch(items, query)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'p') {
        event.preventDefault()
        setOpen(true)
        setQuery('')
        setIndex(0)
      }
      if (event.key === 'Escape') {
        setOpen(false)
        setQuery('')
        setIndex(0)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    setIndex(0)
  }, [query])

  const visibleItems = useMemo(() => filtered.slice(0, 8), [filtered])

  const navigate = (delta: number) => {
    setIndex((prev) => Math.max(0, Math.min(visibleItems.length - 1, prev + delta)))
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      navigate(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      navigate(-1)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const selected = visibleItems[index]
      if (selected) {
        window.open(selected.path || '', '_blank')
        setOpen(false)
        setQuery('')
      }
    } else if (event.key === 'Tab') {
      event.preventDefault()
      navigate(1)
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="ds-btn ds-btn-ghost">
        <Search size={16} />
        Buscar
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center p-4">
            <motion.div initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} className="w-full max-w-2xl glass rounded-2xl p-3 shadow-2xl">
              <div className="flex items-center gap-2 px-2 py-1">
                <Search size={18} />
                <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown} placeholder="Pesquisar apps, categorias…" className="w-full bg-transparent outline-none text-white px-2 py-2" autoFocus />
                <button onClick={() => setOpen(false)} className="p-2 rounded hover:bg-white/10"><X size={16} /></button>
              </div>
              <div className="mt-2 flex flex-col gap-2">
                {visibleItems.length === 0 && query && <div className="p-3 text-sm text-white/60">Nenhum resultado.</div>}
                {visibleItems.map((item, idx) => (
                  <div key={item.id} className={`flex items-center justify-between p-2 rounded-lg ${idx === index ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">{item.icon ? <img src={item.icon} alt="" className="w-6 h-6 object-cover rounded" /> : <Sparkles size={16} />}</div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-white/60">{item.category || 'Aplicativo'}</div>
                      </div>
                    </div>
                    <div className="text-xs text-white/40">{idx === index ? 'Enter' : ''}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
