import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Archive, Star, Layers, Clock, Settings, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const items = [
  { to: '/', label: 'Início', icon: Home },
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
      className="flex w-18 min-w-[72px] flex-col gap-3 bg-[color:var(--ds-800)] p-3 glass-border lg:w-64"
    >
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[color:var(--ds-red)] text-sm font-semibold shadow-[0_0_30px_rgba(255,0,0,0.2)]">C</div>
        <div className="hidden text-sm font-semibold lg:block">Castle</div>
      </div>

      <nav className="flex-1 overflow-auto" aria-label="Navegação principal">
        <ul className="flex flex-col gap-1">
          {items.map((it) => {
            const Icon = it.icon
            return (
              <li key={it.to}>
                <NavLink
                  to={it.to}
                  end={it.to === '/'}
                  aria-label={it.label}
                  className={({ isActive }) =>
                    clsx('flex items-center gap-3 rounded-md p-2 text-sm transition-colors', isActive ? 'bg-[color:var(--ds-700)] text-white' : 'text-white/70 hover:bg-white/5 hover:text-white')
                  }
                >
                  <Icon size={16} />
                  <span className="hidden lg:inline">{it.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto p-2">
        <div className="text-xs text-muted">v0.1</div>
      </div>
    </motion.aside>
  )
}
