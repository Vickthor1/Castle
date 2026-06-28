import React from 'react'
import { motion } from 'framer-motion'

export default function AnimatedSurface({ children, className = '', delay = 0, level = 1 }: { children?: React.ReactNode; className?: string; delay?: number; level?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, delay, ease: 'easeOut' }}
      whileHover={{ y: -3, scale: 1.01, boxShadow: '0 10px 30px rgba(255,0,0,0.08)' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
