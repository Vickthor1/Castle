import React from 'react'
import { motion } from 'framer-motion'

export default function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.55, 0.9, 0.55] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      className="ds-card h-32 rounded-xl"
    >
      <div className="h-4 w-24 rounded bg-white/10" />
      <div className="mt-3 h-3 w-full rounded bg-white/10" />
      <div className="mt-2 h-3 w-3/4 rounded bg-white/10" />
    </motion.div>
  )
}
