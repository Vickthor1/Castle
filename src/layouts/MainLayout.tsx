import React, { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import { getElectronApi } from '@/services/electronApi';

type Props = { children?: ReactNode };

export default function MainLayout({ children }: Props) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        void getElectronApi().hideTrayWindow();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex h-screen overflow-hidden bg-[var(--bg)] text-white">
      <Sidebar />
      <div className="flex-1 flex min-h-screen flex-col overflow-hidden">
        <HeaderBar />
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
          className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
