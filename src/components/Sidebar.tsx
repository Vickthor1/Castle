import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Archive, Star, Layers, Clock, Settings, Info } from 'lucide-react'
import { motion } from 'framer-motion'

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/library', label: 'Biblioteca', icon: Archive },
  { to: '/favorites', label: 'Favoritos', icon: Star },
  { to: '/categories', label: 'Categorias', icon: Layers },
  { to: '/recent', label: 'Recentes', icon: Clock },
  { to: '/settings', label: 'Configurações', icon: Settings },
  { to: '/about', label: 'Sobre', icon: Info }
]

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -12, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="w-64 min-w-[64px] lg:w-64 bg-[color:var(--ds-800)] glass-border p-3 flex flex-col gap-3"
    >
      <div className="px-2 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-[color:var(--ds-red)] flex items-center justify-center shadow-glow">C</div>
        <div className="text-sm font-semibold">Castle</div>
      </div>

      <nav className="flex-1 overflow-auto">
        {items.map((it) => {
          const Icon = it.icon
          return (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-md text-sm hover:bg-white/2 transition-colors ${
                  isActive ? 'bg-[color:var(--ds-700)]' : ''
                }`
              }
            >
              <Icon size={16} />
              <span className="hidden lg:inline">{it.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto p-2">
        <div className="text-xs text-muted">v0.1</div>
      </div>
    </motion.aside>
  )
}
