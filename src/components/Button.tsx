import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export default function Button({ variant = 'primary', className = '', children, ...props }: Props) {
  const base = 'ds-btn'
  const style = variant === 'primary' ? 'ds-btn-primary' : 'ds-btn-ghost'
  return (
    <button className={`${base} ${style} ${className}`} {...props}>
      {children}
    </button>
  )
}
