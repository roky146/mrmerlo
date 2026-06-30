import { createContext, useContext, useEffect, useState } from 'react'

const ThemeCtx = createContext({ dark: false, toggle: () => {} })

export function ThemeCtxProvider({ children }) {
  const [dark, setDark] = useState(false)

  /* Init: check localStorage, fallback to system preference */
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored) {
      setDark(stored === 'dark')
    } else {
      setDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  /* Apply data-theme attribute to <html> whenever dark changes */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggle = () => setDark(v => !v)

  return (
    <ThemeCtx.Provider value={{ dark, toggle }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useThemeCtx = () => useContext(ThemeCtx)
