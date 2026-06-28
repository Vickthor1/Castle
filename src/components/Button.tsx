import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export default function Button({ variant = 'primary', className = '', children, type = 'button', disabled, ...props }: Props) {
  const style = variant === 'primary' ? 'ds-btn-primary' : 'ds-btn-ghost'

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97 }}
      whileHover={disabled ? undefined : { y: -2, scale: 1.01 }}
      type={type}
      disabled={disabled}
      className={clsx('ds-btn', style, className, disabled && 'opacity-60 cursor-not-allowed')}
      {...props}
    >
      {children}
    </motion.button>
  )
}
