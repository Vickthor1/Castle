import React from 'react';
import { NavLink } from 'react-router-dom';
import { Archive, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const items = [
  { to: '/', label: 'Biblioteca', icon: Archive },
  { to: '/settings', label: 'Configurações', icon: Settings },
];

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -18, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex h-full min-w-[72px] w-20 flex-col border-r border-[color:var(--border)] bg-[rgba(10,10,10,0.95)] px-3 py-4 text-white shadow-soft md:w-72"
    >
      <div className="mb-4 flex items-center gap-3 rounded-[8px] border border-[color:var(--border)] bg-[#0F0F0F] px-4 py-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[color:var(--ds-red)] text-2xl font-black text-black">
          C
        </div>
        <div className="hidden flex-col gap-1 md:flex">
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
            Castle
          </span>
          <span className="text-xs uppercase tracking-[0.32em] text-white/50">Launcher</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto pr-1">
        <ul className="flex flex-col gap-2">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <li key={it.to}>
                <NavLink
                  to={it.to}
                  end={it.to === '/'}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-[rgba(255,0,0,0.14)] text-white shadow-[inset_0_0_0_1px_rgba(255,0,0,0.22)]'
                        : 'text-white/70 hover:bg-[rgba(255,255,255,0.06)] hover:text-white hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]',
                    )
                  }
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[rgba(255,255,255,0.04)] text-white/80">
                    <Icon size={18} />
                  </div>
                  <span className="hidden md:inline">{it.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );
}
