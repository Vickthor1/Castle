import React, { createContext, useContext, useState, type ReactNode } from 'react'

type ThemeContextValue = {
  theme: 'light' | 'dark'
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'light', toggle: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeContextValue['theme']>('light')
  return <ThemeContext.Provider value={{ theme, toggle: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')) }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
