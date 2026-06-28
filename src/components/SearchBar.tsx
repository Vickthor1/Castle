import React from 'react';
import { Search } from 'lucide-react';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function SearchBar(props: Props) {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
        <Search size={18} />
      </div>
      <input
        placeholder="Pesquisar..."
        className="ds-input w-full pl-12 text-sm text-white placeholder:text-white/35"
        aria-label="Pesquisar"
        {...props}
      />
    </div>
  );
}
