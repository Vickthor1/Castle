import React from 'react';
import { Heart, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { AppItem } from '@/types/library';
import AppIcon from '@/components/AppIcon';

type CategoryOption = { id: string; name: string };

export default function SteamCard({
  item,
  selected,
  categories,
  onClick,
  onContextMenu,
  onToggleFavorite,
  onAssignCategory,
  onDragStart,
  onDrop,
}: {
  item: AppItem;
  selected?: boolean;
  categories?: CategoryOption[];
  onClick?: (it: AppItem) => void;
  onContextMenu?: (e: React.MouseEvent, it: AppItem) => void;
  onToggleFavorite?: (it: AppItem) => void;
  onAssignCategory?: (it: AppItem, categoryId: string | null) => void;
  onDragStart?: (it: AppItem) => void;
  onDrop?: (it: AppItem) => void;
}) {
  return (
    <motion.div
      layout
      draggable
      whileHover={{ translateY: -8 }}
      className={clsx(
        'ds-card relative cursor-grab overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:shadow-[0_26px_100px_rgba(255,0,0,0.18)]',
        selected && 'ring-1 ring-red-500/40',
      )}
      onClick={() => onClick?.(item)}
      onContextMenu={(e) => onContextMenu?.(e, item)}
      onDragStart={() => onDragStart?.(item)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop?.(item)}
    >
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[rgba(255,0,0,0.12)] via-transparent to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_40%)]" />
        <div className="absolute left-4 top-4 rounded-full bg-[rgba(0,0,0,0.45)] px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
          {item.sourceType || 'App'}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative flex h-full items-center justify-center">
          <AppIcon
            src={item.icon}
            className="h-24 w-24 rounded-[28px] border border-white/10 object-cover shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
          />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold text-white">{item.name}</div>
            <div className="mt-1 text-sm text-white/50">{item.path || 'Sem caminho definido'}</div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(item);
            }}
            className="grid h-10 w-10 place-items-center rounded-[16px] border border-white/10 bg-[rgba(255,255,255,0.05)] text-white/70 transition hover:bg-[rgba(255,255,255,0.12)]"
            aria-label={item.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart
              size={18}
              className={item.favorite ? 'text-[color:var(--ds-red)]' : 'text-white/60'}
            />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/60">
            {item.category || 'Sem categoria'}
          </span>
          <span className="rounded-full border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/60">
            {item.favorite ? 'Favorito' : 'Normal'}
          </span>
        </div>

        {categories && categories.length > 0 && (
          <label className="mt-4 block text-xs text-white/70">
            Categoria
            <select
              className="ds-select mt-2 w-full text-sm text-white"
              value={categories.find((c) => c.name === item.category)?.id ?? ''}
              onChange={(e) => onAssignCategory?.(item, e.target.value || null)}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="">Sem categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {selected && (
        <div className="absolute inset-0 rounded-[28px] border-2 border-[color:var(--ds-red)] pointer-events-none" />
      )}
      <div className="absolute top-3 right-3 rounded-full bg-[rgba(0,0,0,0.5)] p-2 text-white/70 shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
        <MoreHorizontal size={16} />
      </div>
    </motion.div>
  );
}
