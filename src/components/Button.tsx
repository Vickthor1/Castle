import React from 'react'
import { motion } from 'framer-motion'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export default function Button({ variant = 'primary', className = '', children, ...props }: Props) {
  const base = 'ds-btn'
  const style = variant === 'primary' ? 'ds-btn-primary' : 'ds-btn-ghost'
  return (
    <motion.button whileTap={{ scale: 0.97 }} whileHover={{ y: -2, scale: 1.01 }} className={`${base} ${style} ${className}`} {...props}>
      {children}
    </motion.button>
  )
}
