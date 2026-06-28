import React from 'react'
import { RefreshCw, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SpotlightSearch from '@/components/SpotlightSearch'

export default function HeaderBar() {
  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-[color:var(--ds-800)]/70 p-4 backdrop-blur-xl"
    >
      <div className="min-w-[220px] flex-1">
        <SpotlightSearch />
      </div>

      <div className="flex items-center gap-2">
        <button type="button" className="ds-btn ds-btn-ghost" aria-label="Atualizar">
          <RefreshCw size={16} />
        </button>
        <Link to="/settings" className="ds-btn ds-btn-ghost" aria-label="Configurações">
          <Settings size={16} />
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--ds-700)] text-sm">U</div>
          <div className="hidden text-sm sm:block">Usuário</div>
        </div>
      </div>
    </motion.header>
  )
}
