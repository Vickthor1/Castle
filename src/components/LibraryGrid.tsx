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
  const { width } = size

  const columnWidth = 220
  const rowHeight = 240
  const columnCount = Math.max(1, Math.floor((width || window.innerWidth) / columnWidth))
  const rowCount = Math.ceil(items.length / columnCount)

  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }) => {
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
    [items, columnCount, onOpen, onToggleFavorite]
  )

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <div style={{ height: 'calc(100vh - 220px)' }}>
        <Grid
          columnCount={columnCount}
          columnWidth={columnWidth}
          height={Math.max(300, window.innerHeight - 220)}
          rowCount={rowCount}
          rowHeight={rowHeight}
          width={width || window.innerWidth}
          overscanRowCount={3}
          overscanColumnCount={2}
        >
          {Cell}
        </Grid>
      </div>
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
