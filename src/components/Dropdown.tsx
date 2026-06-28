import React, { ReactNode } from 'react'

export default function Dropdown({ children }: { children?: ReactNode }) {
  return <div className="ds-dropdown">{children}</div>
}
