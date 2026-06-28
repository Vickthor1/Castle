import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import MainLayout from '@/layouts/MainLayout'
import LibraryPage from '@/pages/Library'
import SettingsPage from '@/pages/Settings'
import { LibraryProvider } from '@/contexts/LibraryContext'

export default function App() {
  return (
    <LibraryProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </MainLayout>
    </LibraryProvider>
  )
}
