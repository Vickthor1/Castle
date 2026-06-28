import React from 'react'
import { Search } from 'lucide-react'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export default function SearchBar(props: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          placeholder="Pesquisar"
          className="ds-input pl-10 w-full"
          aria-label="Pesquisar"
          {...props}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
          <Search size={16} />
        </div>
      </div>
    </div>
  )
}
