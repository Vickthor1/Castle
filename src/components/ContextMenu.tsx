import React from 'react'

export default function ContextMenu({ x, y, items, onClose }: { x: number; y: number; items: { label: string; onClick: () => void }[]; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', left: x, top: y, zIndex: 9999 }} onMouseLeave={onClose} className="ds-dropdown">
      {items.map((it) => (
        <div key={it.label} className="ds-item" onClick={() => { it.onClick(); onClose() }}>
          {it.label}
        </div>
      ))}
    </div>
  )
}
