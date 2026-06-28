import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLibrary } from '@/contexts/LibraryContext';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function Dashboard() {
  const { items, meta, refreshApps } = useLibrary();

  const topApps = useMemo(() => {
    return [...items].sort((a, b) => (meta.usage[b.id] || 0) - (meta.usage[a.id] || 0)).slice(0, 4);
  }, [items, meta.usage]);

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-4 xl:grid-cols-4"
      >
        <Card>
          <div className="text-sm text-muted uppercase tracking-[0.24em]">Total</div>
          <div className="mt-4 text-3xl font-semibold">{items.length}</div>
          <div className="mt-2 text-sm text-white/60">Aplicativos detectados</div>
        </Card>
        <Card>
          <div className="text-sm text-muted uppercase tracking-[0.24em]">Favoritos</div>
          <div className="mt-4 text-3xl font-semibold">{meta.favorites.length}</div>
          <div className="mt-2 text-sm text-white/60">Itens salvos como favoritos</div>
        </Card>
        <Card>
          <div className="text-sm text-muted uppercase tracking-[0.24em]">Recentes</div>
          <div className="mt-4 text-3xl font-semibold">{meta.recent.length}</div>
          <div className="mt-2 text-sm text-white/60">Aberturas recentes</div>
        </Card>
        <Card>
          <div className="text-sm text-muted uppercase tracking-[0.24em]">Fixados</div>
          <div className="mt-4 text-3xl font-semibold">{meta.pinned.length}</div>
          <div className="mt-2 text-sm text-white/60">Itens fixados na biblioteca</div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: 0.05 }}
        className="grid gap-4 xl:grid-cols-[1.5fr_1fr]"
      >
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm text-muted uppercase tracking-[0.24em]">Continue agora</div>
              <div className="mt-2 text-xl font-semibold">Ações rápidas</div>
            </div>
            <Button variant="ghost" onClick={() => void refreshApps()}>
              Atualizar biblioteca
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[color:var(--ds-700)] p-4">
              <div className="text-sm text-white/70">Mais usado</div>
              <div className="mt-3 text-lg font-semibold">
                {topApps[0]?.name || 'Nenhum app disponível'}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[color:var(--ds-700)] p-4">
              <div className="text-sm text-white/70">Último aberto</div>
              <div className="mt-3 text-lg font-semibold">
                {items.find((item) => item.id === meta.recent[0])?.name || 'Nenhum histórico'}
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <div className="text-sm text-muted uppercase tracking-[0.24em]">Top da semana</div>
          <div className="grid gap-3">
            {topApps.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-white/10 bg-[color:var(--ds-700)] p-4"
              >
                <div className="text-sm text-white/70">{app.sourceLabel}</div>
                <div className="mt-2 text-lg font-semibold">{app.name}</div>
                <div className="mt-1 text-xs text-white/60">
                  {meta.usage[app.id] || 0} execuções
                </div>
              </div>
            ))}
            {topApps.length === 0 && (
              <div className="text-sm text-white/60">Nenhum uso registrado ainda.</div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
