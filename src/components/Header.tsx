import React from 'react'
import { LucideHome } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-gray-50 border-b">
      <div className="max-w-6xl mx-auto p-4 flex items-center gap-3">
        <LucideHome />
        <h2 className="text-lg font-semibold">Castle</h2>
      </div>
    </header>
  )
}
