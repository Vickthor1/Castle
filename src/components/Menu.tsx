import React from 'react'

export default function Menu({ items }: { items: string[] }) {
  return (
    <div className="ds-dropdown">
      {items.map((it) => (
        <div key={it} className="ds-item">
          {it}
        </div>
      ))}
    </div>
  )
}
