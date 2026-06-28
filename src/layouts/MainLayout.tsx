import React, { ReactNode, useEffect } from 'react'
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
        <main className="flex-1 overflow-auto p-6">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
