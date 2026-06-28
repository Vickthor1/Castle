import React from 'react'
import { motion } from 'framer-motion'

export default function CardItem({ title, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.25, ease: 'easeOut' }} whileHover={{ y: -4, scale: 1.01, boxShadow: '0 12px 30px rgba(255,0,0,0.08)' }} className="ds-card cursor-pointer">
      {title && <div className="text-sm font-semibold mb-2">{title}</div>}
      <div>{children}</div>
    </motion.div>
  )
}
