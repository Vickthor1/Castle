import React from 'react'

export default function Tooltip({ children }: { children?: React.ReactNode }) {
  return <div className="ds-tooltip">{children}</div>
}
