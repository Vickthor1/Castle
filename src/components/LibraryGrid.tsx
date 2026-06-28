import React, { useMemo, useState, useCallback } from 'react'
import { FixedSizeGrid as Grid } from 'react-window'
import SteamCard from './SteamCard'
import type { AppItem } from '@/types/library'
import { useSize } from '@/hooks/useSize'
import ContextMenu from './ContextMenu'

export default function LibraryGrid({ items, categories, onToggleFavorite, onOpen, onAssignCategory, onReorder }: { items: AppItem[]; categories?: Array<{ id: string; name: string }>; onToggleFavorite?: (it: AppItem) => void; onOpen?: (it: AppItem) => void; onAssignCategory?: (it: AppItem, categoryId: string | null) => void; onReorder?: (sourceId: string, targetId: string) => void }) {
  const { ref, size } = useSize<HTMLDivElement>()
  const [context, setContext] = useState<{ x: number; y: number; item: AppItem } | null>(null)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const { width, height } = size

  const columnWidth = 220
  const rowHeight = 240
  const effectiveWidth = width || window.innerWidth || 960
  const effectiveHeight = Math.max(320, height || window.innerHeight - 260)
  const columnCount = Math.max(1, Math.floor(effectiveWidth / columnWidth))
  const rowCount = Math.ceil(items.length / columnCount)

  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
      const index = rowIndex * columnCount + columnIndex
      if (index >= items.length) return null
      const item = items[index]
      return (
        <div style={{ ...style, padding: 8 }}>
          <SteamCard
            item={item}
            onClick={() => onOpen?.(item)}
            onContextMenu={(e) => {
              e.preventDefault()
              setContext({ x: e.clientX, y: e.clientY, item })
            }}
            categories={categories}
            onToggleFavorite={() => onToggleFavorite?.(item)}
            onAssignCategory={(_it, categoryId) => onAssignCategory?.(item, categoryId)}
            onDragStart={(dragItem) => setDraggedId(dragItem.id)}
            onDrop={(dropItem) => {
              if (draggedId && draggedId !== dropItem.id) onReorder?.(draggedId, dropItem.id)
              setDraggedId(null)
            }}
          />
        </div>
      )
    },
    [categories, columnCount, draggedId, items, onAssignCategory, onOpen, onReorder, onToggleFavorite]
  )

  const gridHeight = useMemo(() => Math.max(320, effectiveHeight), [effectiveHeight])

  return (
    <div ref={ref} className="h-full w-full min-h-[320px]">
      {items.length === 0 ? (
        <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[color:var(--surface-2)] text-sm text-white/60">
          Nenhum app encontrado.
        </div>
      ) : (
        <Grid
          columnCount={columnCount}
          columnWidth={columnWidth}
          height={gridHeight}
          rowCount={rowCount}
          rowHeight={rowHeight}
          width={effectiveWidth}
          overscanRowCount={3}
          overscanColumnCount={2}
        >
          {Cell}
        </Grid>
      )}
      {context && (
        <ContextMenu
          x={context.x}
          y={context.y}
          items={[
            { label: 'Abrir', onClick: () => onOpen?.(context.item) },
            { label: context.item.favorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos', onClick: () => onToggleFavorite?.(context.item) }
          ]}
          onClose={() => setContext(null)}
        />
      )}
    </div>
  )
}
