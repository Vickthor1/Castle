import React from 'react';
import { motion } from 'framer-motion';

export default function HeaderBar() {
  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex items-center justify-between border-b border-[color:var(--border)] bg-[rgba(15,15,15,0.92)]/95 px-4 py-4 md:px-6"
    >
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">
        Castle Launcher
      </div>
      <div className="text-xs text-white/60">
        Library, search, favorites, categories, and basic settings.
      </div>
    </motion.header>
  );
}
