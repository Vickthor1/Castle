import React from 'react';
import { Grid, List, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/Button';
import SpotlightSearch from '@/components/SpotlightSearch';

export default function HeaderBar() {
  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex flex-col gap-4 border-b border-[color:var(--border)] bg-[rgba(15,15,15,0.92)]/95 px-4 py-4 backdrop-blur-xl backdrop-saturate-150 md:px-6 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="rounded-[8px] border border-[color:var(--border)] bg-[#0F0F0F] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/90">
          Castle Launcher
        </div>
        <div className="hidden items-center gap-2 rounded-[8px] border border-[color:var(--border)] bg-[#0F0F0F] px-3 py-2 text-sm text-white/70 sm:flex">
          <span className="font-medium text-white/90">Modo Premium</span>
          <span className="inline-flex items-center gap-2 rounded-[8px] bg-[rgba(255,0,0,0.12)] px-3 py-1 text-xs uppercase tracking-[0.16em] text-red-300">
            Design
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        <div className="relative w-full min-w-[240px] sm:w-[360px]">
          <SpotlightSearch />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" className="p-3 rounded-[8px]" aria-label="Lista">
            <Grid size={16} />
          </Button>
          <Button variant="ghost" className="p-3 rounded-[8px]" aria-label="Grade">
            <List size={16} />
          </Button>
          <Button variant="ghost" className="p-3 rounded-[8px]" aria-label="Configurações">
            <Settings size={16} />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
