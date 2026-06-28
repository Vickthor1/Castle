import React from 'react'
import { Heart, MoreHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import type { AppItem } from '@/types/library'

type CategoryOption = { id: string; name: string }

export default function SteamCard({
  item,
  selected,
  categories,
  onClick,
  onContextMenu,
  onToggleFavorite,
  onAssignCategory,
  onDragStart,
  onDrop
}: {
  item: AppItem
  selected?: boolean
  categories?: CategoryOption[]
  onClick?: (it: AppItem) => void
  onContextMenu?: (e: React.MouseEvent, it: AppItem) => void
  onToggleFavorite?: (it: AppItem) => void
  onAssignCategory?: (it: AppItem, categoryId: string | null) => void
  onDragStart?: (it: AppItem) => void
  onDrop?: (it: AppItem) => void
}) {
  return (
    <motion.div
      layout
      draggable
      whileHover={{ translateY: -6 }}
      className={clsx('relative rounded-lg overflow-hidden cursor-pointer', 'bg-[color:var(--surface-2)] border border-white/4')}
      onClick={() => onClick?.(item)}
      onContextMenu={(e) => onContextMenu?.(e, item)}
      onDragStart={() => onDragStart?.(item)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop?.(item)}
    >
      <div className="w-full h-36 bg-[color:var(--ds-700)] flex items-center justify-center">{item.icon ? <img src={item.icon} alt="" className="w-20 h-20 object-cover rounded" /> : <div className="w-16 h-16 rounded bg-[color:var(--ds-800)] flex items-center justify-center">I</div>}</div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate font-semibold">{item.name}</div>
          <button onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(item) }} className="p-1 rounded hover:bg-white/2">
            <Heart size={16} className={item.favorite ? 'text-[color:var(--ds-red)]' : 'text-white/60'} />
          </button>
        </div>
        {item.category && <div className="text-xs text-white/60 mt-1">{item.category}</div>}
        {categories && categories.length > 0 && (
          <select
            className="ds-input mt-2 w-full text-xs"
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
        )}
      </div>
      {selected && <div className="absolute inset-0 border-2 border-[color:var(--ds-red)] rounded-lg pointer-events-none" />}
      <div className="absolute top-2 right-2 p-1 rounded hover:bg-white/3"><MoreHorizontal size={16} /></div>
    </motion.div>
  )
}
