import React, { ReactNode, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import HeaderBar from '@/components/HeaderBar'
import Footer from '@/components/Footer'

type Props = { children?: ReactNode }

export default function MainLayout({ children }: Props) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        void window.electron?.hideTrayWindow?.()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="min-h-screen flex h-screen text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <HeaderBar />
        <motion.main initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="flex-1 overflow-auto p-6">
          {children}
        </motion.main>
        <Footer />
      </div>
    </div>
  )
}
