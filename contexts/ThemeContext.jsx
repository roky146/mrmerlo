import { createContext, useContext, useEffect, useState } from 'react'

const ThemeCtx = createContext({ dark: false, toggle: () => {} })

export function ThemeCtxProvider({ children }) {
  const [dark, setDark] = useState(false)

  /* Init: preferencia guardada → si no hay, OSCURO por defecto */
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    setDark(stored === 'light' ? false : true)
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
