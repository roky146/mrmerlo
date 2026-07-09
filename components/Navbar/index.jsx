import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeCtx } from '../../contexts/ThemeContext'
import { useLang } from '../../contexts/LanguageContext'
import { useContact } from '../../contexts/ContactContext'

/* ─── Nav shell ─────────────────────────────────────────────── */

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 4rem;
  padding-right: calc(4rem + var(--scrollbar-w, 0px));
  pointer-events: none;

  background: rgba(var(--nav-bg-rgb, 240, 250, 244), 0.30);
  backdrop-filter: blur(4px) saturate(1.8);
  -webkit-backdrop-filter: blur(4px) saturate(1.8);
  border-bottom: 1px solid var(--border);
  transition: background 0.3s, border-color 0.3s;

  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    padding-right: calc(1.5rem + var(--scrollbar-w, 0px));
  }
`

/* ─── Logo morph: círculo con "M" ⇄ wordmark "mrmerlo" ─────── */

const LogoBtn = styled.button`
  pointer-events: all;
  display: inline-flex;
  align-items: center;
  height: 42px;
  background: none;
  border: none;
  padding: 0;
`

const MWrap = styled.div`
  position: relative;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

/* El círculo que rodea la M (se desvanece "ampliándose" al hacer scroll) */
const Circle = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--text-primary);
  transition: border-color 0.3s;

  @media (hover: hover) {
    ${LogoBtn}:hover & { border-color: var(--accent-dim); }
  }
`

/* La "M" persiste siempre (Major Mono Display = fuente de branding) */
const MGlyph = styled(motion.span)`
  font-family: 'Major Mono Display', ui-monospace, monospace;
  font-size: 1.6rem;
  line-height: 1;
  color: var(--text-primary);
  transform-origin: center;
  transition: color 0.25s;
  z-index: 1;

  @media (hover: hover) {
    ${LogoBtn}:hover & { color: var(--accent-dim); }
  }
`

/* "RMERLO" — aparece junto a la M para completar MRMERLO */
const Rest = styled(motion.span)`
  font-family: 'Major Mono Display', ui-monospace, monospace;
  font-size: 1.6rem;
  line-height: 1;
  color: var(--text-primary);
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  transition: color 0.25s;

  @media (hover: hover) {
    ${LogoBtn}:hover & { color: var(--accent-dim); }
  }
`

/* ─── Floating back-to-top (aparece al hacer scroll) ───────── */

const BackToTop = styled(motion.button)`
  position: fixed;
  bottom: 1.5rem;
  right: calc(1.5rem + var(--scrollbar-w, 0px));
  z-index: 95;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--text-primary);
  background: rgba(var(--nav-bg-rgb, 240, 250, 244), 0.4);
  backdrop-filter: blur(4px) saturate(1.6);
  -webkit-backdrop-filter: blur(4px) saturate(1.6);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
  transition: border-color 0.25s, background 0.25s;

  &:hover { border-color: var(--accent-dim); }
  svg { width: 1.2rem; height: 1.2rem; }

  @media (max-width: 768px) {
    bottom: 1.25rem;
    right: 1.25rem;
    width: 46px;
    height: 46px;
  }
`

/* ─── Right controls group ───────────────────────────────────── */

const NavControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  pointer-events: all;
`

/* Enlaces principales en el header (solo desktop) */
const DesktopLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4rem;
  margin-right: 0.5rem;

  @media (max-width: 900px) { display: none; }
`

const DesktopLink = styled.a`
  pointer-events: all;
  position: relative;
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--text-secondary);
  transition: color 0.2s;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -3px;
    width: 100%;
    height: 1.5px;
    background: var(--accent-dim);
    transform: scaleX(0);
    transform-origin: 100% 50%;
    transition: transform 0.3s ease;
  }
  &:hover {
    color: var(--text-primary);
    &::after { transform: scaleX(1); transform-origin: 0 50%; }
  }
`

/* Iconos sociales visibles en el header (solo desktop) */
const DesktopSocial = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-right: 0.2rem;

  @media (max-width: 900px) { display: none; }
`

/* Shared icon button style */
const IconBtn = styled.button`
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: none;
  color: var(--text-secondary);
  transition: color 0.2s, border-color 0.2s, background 0.2s;
  flex-shrink: 0;

  svg { width: 1rem; height: 1rem; }

  &:hover {
    color: var(--text-primary);
    border-color: var(--text-primary);
  }
`

const LangWrapper = styled.div`
  position: relative;
`

const LangBtn = styled.button`
  pointer-events: all;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  height: 36px;
  padding: 0 0.85rem;
  border-radius: 999px;
  border: 2px solid var(--border);
  background: none;
  color: var(--text-secondary);
  font-family: 'Inter', sans-serif;
  font-size: 0.73rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color 0.2s, border-color 0.2s;

  &:hover {
    color: var(--text-primary);
    border-color: var(--text-primary);
  }
`

const LangDot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent-dim);
  flex-shrink: 0;
`

const LangDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 130px;
  background: rgba(var(--nav-bg-rgb, 240, 250, 244), 0.92);
  backdrop-filter: blur(16px) saturate(1.6);
  -webkit-backdrop-filter: blur(16px) saturate(1.6);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 0.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  z-index: 200;
  overflow: hidden;
`

const LangOption = styled.button`
  pointer-events: all;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.5rem 0.65rem;
  border-radius: 6px;
  border: none;
  background: ${p => p.$active ? 'var(--border)' : 'none'};
  color: ${p => p.$active ? 'var(--text-primary)' : 'var(--text-secondary)'};
  font-family: 'Inter', sans-serif;
  font-size: 0.78rem;
  font-weight: ${p => p.$active ? '600' : '400'};
  letter-spacing: 0.04em;
  text-align: left;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;

  &:hover {
    background: var(--border);
    color: var(--text-primary);
  }
`

/* ─── Hamburger (solo móvil/tablet) ──────────────────────────── */

const HamburgerBtn = styled.button`
  pointer-events: all;
  position: relative;
  width: 28px;
  height: 20px;
  background: none;
  border: none;
  padding: 0;

  @media (min-width: 901px) { display: none; }
`

const BAR_STYLE = {
  position: 'absolute',
  left: 0,
  height: '1.5px',
  background: 'var(--text-primary)',
  borderRadius: '2px',
  transformOrigin: 'center center',
}

/* ─── Overlay (móvil) ───────────────────────────────────────── */

const MenuBlack = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 98;
  pointer-events: none;
`

const MenuOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: var(--bg);
  z-index: 99;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 8rem 4rem 4rem;
  gap: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 7rem 5.5rem 4rem 1.5rem;
    gap: 2rem;
  }
`

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.1rem;
`

const MenuItemWrapper = styled.div`
  overflow: hidden;
  line-height: 1.2;
`

const MenuItem = styled(motion.div)`
  font-family: 'Gilroy', 'Satoshi', sans-serif;
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 475;
  letter-spacing: -0.02em;
  line-height: 1.35;

  a {
    display: block;
    position: relative;
    width: max-content;
    padding-bottom: 2px;
    color: var(--text-primary);
    transition: letter-spacing 0.4s cubic-bezier(0, -0.04, 0, 0.96),
                color 0.25s ease;

    &::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      width: 100%;
      height: 1.5px;
      background: var(--accent-dim);
      transform: scaleX(0);
      transform-origin: 100% 50%;
      transition: transform 0.35s ease-in-out;
    }

    &:hover {
      color: var(--accent-dim);
      letter-spacing: 2px;
      &::after {
        transform: scaleX(1);
        transform-origin: 0% 50%;
      }
    }
  }
`

const SocialGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  align-self: center;
  height: min(380px, 55vh);
  border: 1px solid var(--border);

  @media (max-width: 768px) { display: none; }
`

const MobileSocialStack = styled(motion.div)`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    align-items: center;
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
  }
`

const MobileSocialCircle = styled.a`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: background 0.3s, color 0.3s, border-color 0.3s;
  flex-shrink: 0;

  svg { width: 1.1rem; height: 1.1rem; }

  &:hover {
    background: var(--text-primary);
    color: var(--bg);
    border-color: var(--text-primary);
  }
`

const SocialCell = styled.a`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.75rem;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  transition: color 0.35s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--text-primary);
    transform: scale(0);
    transform-origin: ${p => p.$origin};
    transition: transform 0.45s cubic-bezier(0.76, 0, 0.24, 1);
    z-index: 0;
  }

  &:hover {
    color: var(--bg);
    &::before { transform: scale(1); }
  }
`

const SocialIcon = styled.span`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  svg { width: 1.6rem; height: 1.6rem; }
`

const SocialLabel = styled.span`
  position: relative;
  z-index: 1;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
`

const MenuFooter = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 4rem;
  right: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) { left: 1.5rem; right: 1.5rem; }
`

const MenuFooterText = styled.span`
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
`

/* ─── Icons ──────────────────────────────────────────────────── */

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const ArrowUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>
  </svg>
)

/* ─── Social data ────────────────────────────────────────────── */

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/roky146',
    origin: 'top left',
    external: true,
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/marcos-rodríguez-merlo-367569224',
    origin: 'top right',
    external: true,
    icon: (
      <svg viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:marcosrodriguezmerlo@gmail.com',
    origin: 'bottom left',
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
  },
  {
    label: 'CV',
    href: '/cv.pdf',
    origin: 'bottom right',
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
    ),
  },
]

/* ─── Variants ───────────────────────────────────────────────── */

const itemVariant = (i) => ({
  hidden: { y: '110%' },
  visible: { y: 0, transition: { duration: 0.65, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] } }
})

const LANG_OPTIONS = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'it', label: 'Italiano' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
]

/* ── Banderas SVG (los emojis de bandera no renderizan en Windows) ── */
const FlagWrap = styled.span`
  display: inline-block;
  width: 20px;
  height: 14px;
  border-radius: 3px;
  overflow: hidden;
  flex-shrink: 0;
  line-height: 0;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
  svg { display: block; width: 100%; height: 100%; }
`

const FLAGS = {
  es: <svg viewBox="0 0 20 14"><rect width="20" height="14" fill="#c60b1e"/><rect y="3.5" width="20" height="7" fill="#ffc400"/></svg>,
  en: <svg viewBox="0 0 20 14"><rect width="20" height="14" fill="#012169"/><path d="M0 0 20 14M20 0 0 14" stroke="#fff" strokeWidth="2.6"/><path d="M0 0 20 14M20 0 0 14" stroke="#C8102E" strokeWidth="1.2"/><rect x="8" width="4" height="14" fill="#fff"/><rect y="5" width="20" height="4" fill="#fff"/><rect x="8.75" width="2.5" height="14" fill="#C8102E"/><rect y="5.75" width="20" height="2.5" fill="#C8102E"/></svg>,
  it: <svg viewBox="0 0 20 14"><rect width="20" height="14" fill="#fff"/><rect width="6.67" height="14" fill="#008C45"/><rect x="13.33" width="6.67" height="14" fill="#CD212A"/></svg>,
  fr: <svg viewBox="0 0 20 14"><rect width="20" height="14" fill="#fff"/><rect width="6.67" height="14" fill="#0055A4"/><rect x="13.33" width="6.67" height="14" fill="#EF4135"/></svg>,
  pt: <svg viewBox="0 0 20 14"><rect width="20" height="14" fill="#009B3A"/><path d="M10 1.5 18.5 7 10 12.5 1.5 7Z" fill="#FEDF00"/><circle cx="10" cy="7" r="3" fill="#002776"/></svg>,
}

function Flag({ code }) {
  return <FlagWrap aria-hidden="true">{FLAGS[code] || null}</FlagWrap>
}

/* ─── Component ──────────────────────────────────────────────── */

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const langRef = useRef(null)
  const router = useRouter()
  const { dark, toggle: toggleTheme } = useThemeCtx()
  const { lang, t, setLang } = useLang()
  const { open: openContact } = useContact()

  const menuLinks = [
    { label: t('nav_home'),     href: '/' },
    { label: t('nav_projects'), href: '/#projects' },
    { label: t('nav_about'),    href: '/about' },
    { label: t('nav_contact'),  contact: true },
  ]

  /* Bloquear scroll con overlay abierto */
  useEffect(() => {
    if (open) {
      const scrollbarW = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      if (scrollbarW > 0) {
        document.body.style.paddingRight = `${scrollbarW}px`
        document.documentElement.style.setProperty('--scrollbar-w', `${scrollbarW}px`)
      }
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      document.documentElement.style.setProperty('--scrollbar-w', '0px')
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      document.documentElement.style.setProperty('--scrollbar-w', '0px')
    }
  }, [open])

  /* Detectar scroll más allá del hero (funciona en cualquier página) */
  useEffect(() => {
    const threshold = () => Math.min(window.innerHeight * 0.85, 600)
    const onScroll = () => setScrolled(window.scrollY > threshold())
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const lenis = typeof window !== 'undefined' ? window.__lenis__ : null
    lenis?.on?.('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      lenis?.off?.('scroll', onScroll)
    }
  }, [])

  /* Cerrar dropdown de idioma al hacer click fuera */
  useEffect(() => {
    if (!langOpen) return
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [langOpen])

  const close = () => setOpen(false)

  const scrollToTop = useCallback(() => {
    close()
    if (typeof window !== 'undefined' && window.__lenis__) {
      window.__lenis__.scrollTo(0, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  /* Logo: en el hero = subir; ya con scroll (wordmark MRMERLO) = ir al inicio.
     En la home siempre sube; en subpáginas navega a "/" (transición seamless). */
  const onLogoClick = useCallback(() => {
    close()
    if (router.pathname !== '/') router.push('/')  // el logo SIEMPRE lleva al inicio
    else scrollToTop()
  }, [router, scrollToTop])

  return (
    <>
      <Nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* ── Logo: "M" en círculo → el círculo se desvanece y aparece "RMERLO" = MRMERLO ── */}
        <LogoBtn onClick={onLogoClick} aria-label={scrolled ? 'Ir al inicio' : 'Volver arriba'}>
          <MWrap>
            <Circle
              initial={false}
              animate={scrolled ? { opacity: 0, scale: 1.7 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            />
            <MGlyph
              whileHover={!scrolled ? { scale: 1.03 } : undefined}
              transition={{ duration: 0.25 }}
            >
              M
            </MGlyph>
          </MWrap>
          <Rest
            aria-hidden={!scrolled}
            initial={{ width: 0, opacity: 0 }}
            animate={scrolled
              ? { width: 'auto', opacity: 1, marginLeft: -13 }
              : { width: 0, opacity: 0, marginLeft: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            rMerlo
          </Rest>
        </LogoBtn>

        <NavControls>
          {/* ── Enlaces principales (desktop) ── */}
          <DesktopLinks>
            <DesktopLink as={Link} href="/#projects">{t('nav_projects')}</DesktopLink>
            <DesktopLink as={Link} href="/about">{t('nav_about')}</DesktopLink>
            <DesktopLink as="button" type="button" onClick={openContact}>{t('nav_contact')}</DesktopLink>
          </DesktopLinks>

          {/* ── Social + CV (desktop) ── */}
          <DesktopSocial>
            {socialLinks.map(s => (
              <IconBtn
                as="a"
                key={s.label}
                href={s.href}
                target={s.external ? '_blank' : undefined}
                rel={s.external ? 'noopener noreferrer' : undefined}
                aria-label={s.label}
                title={s.label}
              >
                {s.icon}
              </IconBtn>
            ))}
          </DesktopSocial>

          {/* ── Selector de idioma ── */}
          <LangWrapper ref={langRef}>
            <LangBtn onClick={() => setLangOpen(v => !v)} aria-label="Seleccionar idioma">
              <Flag code={lang} />
              {lang.toUpperCase()}
            </LangBtn>

            <AnimatePresence>
              {langOpen && (
                <LangDropdown
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0,  scale: 1     }}
                  exit={{    opacity: 0, y: -6, scale: 0.96  }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  {LANG_OPTIONS.map(opt => (
                    <LangOption
                      key={opt.code}
                      $active={lang === opt.code}
                      onClick={() => { setLang(opt.code); setLangOpen(false) }}
                    >
                      <Flag code={opt.code} />
                      {opt.label}
                    </LangOption>
                  ))}
                </LangDropdown>
              )}
            </AnimatePresence>
          </LangWrapper>

          {/* ── Toggle tema ── */}
          <IconBtn
            onClick={toggleTheme}
            aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </IconBtn>

          {/* ── Hamburguesa (solo móvil/tablet) ── */}
          <HamburgerBtn
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            <motion.span
              style={{ ...BAR_STYLE, width: '100%' }}
              animate={open ? { top: 9, rotate: 45, width: '100%' } : { top: 3, rotate: 0, width: '100%' }}
              transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.span
              style={{ ...BAR_STYLE }}
              animate={open
                ? { top: 9,  rotate: -45, width: '100%', left: 0, right: 'auto' }
                : { top: 15, rotate: 0,   width: '60%',  left: 'auto', right: 0 }
              }
              transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            />
          </HamburgerBtn>
        </NavControls>
      </Nav>

      {/* ── Botón flotante de subir (aparece al hacer scroll) ── */}
      <AnimatePresence>
        {scrolled && (
          <BackToTop
            key="back-to-top"
            onClick={scrollToTop}
            aria-label="Volver arriba"
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            whileHover={{ y: -3 }}
          >
            <motion.span
              style={{ display: 'flex' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, duration: 0.3, ease: 'easeOut' }}
            >
              <ArrowUpIcon />
            </motion.span>
          </BackToTop>
        )}
      </AnimatePresence>

      {/* ── Overlay (móvil) ── */}
      <AnimatePresence>
        {open && (
          <MenuBlack
            key="menu-black"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)'   }}
            exit={{    clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
          />
        )}
        {open && (
          <MenuOverlay
            key="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)'   }}
            exit={{    clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
          >
            <NavLinks>
              {menuLinks.map((link, i) => (
                <MenuItemWrapper key={link.label}>
                  <MenuItem variants={itemVariant(i)} initial="hidden" animate="visible" onClick={close}>
                    {link.contact
                      ? <a role="button" tabIndex={0} onClick={openContact}>{link.label}</a>
                      : link.external
                        ? <a href={link.href}>{link.label}</a>
                        : <Link href={link.href}>{link.label}</Link>}
                  </MenuItem>
                </MenuItemWrapper>
              ))}
            </NavLinks>

            <SocialGrid initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.4 }}>
              {socialLinks.map(s => (
                <SocialCell
                  key={s.label}
                  href={s.href}
                  target={s.external ? '_blank' : undefined}
                  rel={s.external ? 'noopener noreferrer' : undefined}
                  $origin={s.origin}
                  onClick={close}
                >
                  <SocialIcon>{s.icon}</SocialIcon>
                  <SocialLabel>{s.label}</SocialLabel>
                </SocialCell>
              ))}
            </SocialGrid>

            <MobileSocialStack initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
              {socialLinks.map(s => (
                <MobileSocialCircle
                  key={s.label}
                  href={s.href}
                  target={s.external ? '_blank' : undefined}
                  rel={s.external ? 'noopener noreferrer' : undefined}
                  onClick={close}
                >
                  {s.icon}
                </MobileSocialCircle>
              ))}
            </MobileSocialStack>

            <MenuFooter initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.35 }}>
              <MenuFooterText>mrmerlo.com</MenuFooterText>
              <MenuFooterText>{t('nav_location')}</MenuFooterText>
            </MenuFooter>
          </MenuOverlay>
        )}
      </AnimatePresence>
    </>
  )
}
