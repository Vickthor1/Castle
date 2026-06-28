import React from 'react';
import { motion } from 'framer-motion';
import Grid from '@/components/Grid';
import CardItem from '@/components/CardItem';
import WindowsIntegrationPanel from '@/components/WindowsIntegrationPanel';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="grid gap-4 p-4 md:p-6"
    >
      <div className="ds-card grid gap-4">
        <div className="flex flex-col gap-2">
          <p className="eyebrow">Dashboard</p>
          <h1 className="text-3xl font-semibold text-white">Bem-vindo de volta ao Castle</h1>
          <p className="max-w-2xl text-sm text-white/65">
            Monitore seus jogos, organize categorias e inicie apps a partir de uma interface premium
            em vermelho e preto.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-[8px] border border-[color:var(--border)] bg-[#0F0F0F] p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Status de integração</p>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-white">Windows integrado</p>
                <p className="text-sm text-white/60">
                  Configurações de inicialização e atalhos globais ativados.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-[8px] border border-[color:var(--border)] bg-[#0F0F0F] p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Dica rápida</p>
            <div className="mt-4 space-y-3 text-sm text-white/60">
              <p>
                Use o atalho <strong>Ctrl+P</strong> para abrir a busca rápida.
              </p>
              <p>Arraste seus jogos para reagrupar categorias com facilidade.</p>
              <p>Favorite os apps mais usados para acessá-los rapidamente.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="ds-card rounded-[8px] border border-[color:var(--border)] bg-[#0F0F0F] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">
              Integração com Windows
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">Configurações e atalhos</h2>
          </div>
        </div>
        <div className="mt-4">
          <WindowsIntegrationPanel />
        </div>
      </div>
    </motion.div>
  );
}
