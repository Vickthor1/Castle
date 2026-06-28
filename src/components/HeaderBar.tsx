import React from 'react'
import { RefreshCw, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import SpotlightSearch from '@/components/SpotlightSearch'

export default function HeaderBar() {
  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-4 p-4 border-b glass"
    >
      <div className="flex-1">
        <SpotlightSearch />
      </div>

      <div className="flex items-center gap-3">
        <button className="ds-btn ds-btn-ghost" aria-label="Atualizar">
          <RefreshCw />
        </button>
        <button className="ds-btn ds-btn-ghost" aria-label="Configurações">
          <Settings />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-[color:var(--ds-700)] flex items-center justify-center">U</div>
          <div className="hidden sm:block text-sm">Usuário</div>
        </div>
      </div>
    </motion.header>
  )
}
