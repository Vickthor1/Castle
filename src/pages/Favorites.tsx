import React from 'react';
import { motion } from 'framer-motion';
import { useLibrary } from '@/contexts/LibraryContext';
import LibraryGrid from '@/components/LibraryGrid';
import type { AppItem } from '@/types/library';

export default function FavoritesPage() {
  const { items, meta, toggleFavorite, openApp, categories, assignCategory } = useLibrary();
  const favorites = items.filter((item) => meta.favorites.includes(item.id) && !item.hidden);

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="text-2xl font-semibold">Favoritos</div>
        <p className="text-sm text-white/60">
          Itens marcados como favoritos aparecem aqui para acesso rápido.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.05 }}
        className="min-h-[480px]"
      >
        <LibraryGrid
          items={favorites}
          categories={categories}
          onToggleFavorite={(item) => toggleFavorite(item.id)}
          onOpen={(item) => openApp(item.id)}
          onAssignCategory={(item, categoryId) => assignCategory(item.id, categoryId)}
        />
      </motion.div>
    </div>
  );
}
