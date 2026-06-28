import React from 'react'

export default function CardItem({ title, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <div className="ds-card hover:glow transition-shadow cursor-pointer">
      {title && <div className="text-sm font-semibold mb-2">{title}</div>}
      <div>{children}</div>
    </div>
  )
}
