import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from '../data/translations'

const VALID_LANGS = ['es', 'en', 'it', 'fr', 'pt']

const LangCtx = createContext({ lang: 'es', t: (k) => k, setLang: () => {} })

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('es')

  /* Init: check localStorage */
  useEffect(() => {
    const stored = localStorage.getItem('lang')
    if (VALID_LANGS.includes(stored)) setLangState(stored)
  }, [])

  const setLang = (code) => {
    if (!VALID_LANGS.includes(code)) return
    setLangState(code)
    localStorage.setItem('lang', code)
  }

  /* t(key) — returns translated string or key if missing */
  const t = (key) => translations[lang]?.[key] ?? translations['es']?.[key] ?? key

  return (
    <LangCtx.Provider value={{ lang, t, setLang }}>
      {children}
    </LangCtx.Provider>
  )
}

export const useLang = () => useContext(LangCtx)
