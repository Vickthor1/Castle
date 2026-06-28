import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useFuzzySearch } from '@/hooks/useFuzzySearch';
import { useLibrary } from '@/contexts/LibraryContext';
import AppIcon from '@/components/AppIcon';

export default function SpotlightSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { items } = useLibrary();

  const filtered = useFuzzySearch(items, query);

  const closeModal = () => {
    setOpen(false);
    setQuery('');
    setIndex(0);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        setOpen(true);
        setQuery('');
        setIndex(0);
      }
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setIndex(0);
  }, [query]);

  const visibleItems = useMemo(() => filtered.slice(0, 8), [filtered]);

  const navigate = (delta: number) => {
    setIndex((prev) => Math.max(0, Math.min(visibleItems.length - 1, prev + delta)));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      navigate(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      navigate(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selected = visibleItems[index];
      if (selected) {
        window.open(selected.path || '', '_blank');
        closeModal();
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      navigate(1);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ds-btn ds-btn-ghost w-full justify-between rounded-[20px] px-4 py-3 text-sm text-white/85 hover:bg-[rgba(255,255,255,0.08)]"
      >
        <span className="flex items-center gap-2">
          <Search size={18} className="text-white/70" />
          Buscar
        </span>
        <span className="text-xs uppercase tracking-[0.24em] text-white/40">Ctrl+P</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-[rgba(0,0,0,0.88)] p-6 backdrop-blur-3xl"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
          >
            <motion.div
              initial={{ y: -18, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -12, opacity: 0, scale: 0.98 }}
              className="glass-strong w-full max-w-3xl rounded-[32px] border border-[rgba(255,255,255,0.1)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
              role="dialog"
              aria-modal="true"
              aria-label="Busca rápida"
            >
              <div className="flex items-center gap-3 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[rgba(255,255,255,0.05)] text-white/70">
                  <Search size={20} />
                </div>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Pesquisar apps, categorias…"
                  className="w-full bg-transparent text-lg font-medium text-white placeholder:text-white/35 outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={closeModal}
                  className="grid h-12 w-12 place-items-center rounded-[18px] bg-[rgba(255,255,255,0.04)] text-white/70 transition hover:bg-[rgba(255,255,255,0.08)]"
                  aria-label="Fechar busca"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mt-4 grid gap-3">
                {visibleItems.length === 0 && query ? (
                  <div className="rounded-[26px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5 text-sm text-white/60">
                    Nenhum resultado encontrado.
                  </div>
                ) : (
                  visibleItems.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        window.open(item.path || '', '_blank');
                        closeModal();
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-[24px] border px-4 py-4 text-left transition duration-200 ${
                        idx === index
                          ? 'border-red-500/30 bg-[rgba(255,0,0,0.12)] shadow-[0_0_0_1px_rgba(255,0,0,0.18)]'
                          : 'border-white/10 bg-[rgba(255,255,255,0.02)] hover:border-white/20 hover:bg-[rgba(255,255,255,0.06)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[rgba(255,255,255,0.06)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)]">
                          <AppIcon src={item.icon} className="h-10 w-10 rounded-2xl object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{item.name}</p>
                          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                            {item.category || 'Aplicativo'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                        ENTER
                      </span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
