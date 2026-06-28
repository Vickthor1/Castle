import React, { createContext, useContext, useState, ReactNode } from 'react'

const ThemeContext = createContext({ theme: 'light', toggle: () => {} } as any)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')
  return <ThemeContext.Provider value={{ theme, toggle: () => setTheme(t => (t === 'light' ? 'dark' : 'light')) }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
