import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { LibraryProvider } from '@/contexts/LibraryContext';

const LibraryPage = lazy(() => import('@/pages/Library'));
const SettingsPage = lazy(() => import('@/pages/Settings'));

export default function App() {
  return (
    <LibraryProvider>
      <MainLayout>
        <Suspense fallback={<div className="p-4 text-sm text-white/60">Carregando…</div>}>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </LibraryProvider>
  );
}
