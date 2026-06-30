import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeCtx } from '../../contexts/ThemeContext'
import { useLang } from '../../contexts/LanguageContext'

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

  /* Frost glass — adapts to theme via --nav-bg-rgb */
  background: rgba(var(--nav-bg-rgb, 240, 250, 244), 0.30);
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  border-bottom: 1px solid var(--border);
  transition: background 0.3s, border-color 0.3s;

  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    padding-right: calc(1.5rem + var(--scrollbar-w, 0px));
  }
`

/* Logo is now a button (scroll-to-top), not a Link */
const LogoBtn = styled.button`
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  cursor: none;
  background: none;
  border: none;
  padding: 0;
`

const LogoCircle = styled(motion.div)`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid var(--text-primary);
  transition: border-color 0.3s;

  ${LogoBtn}:hover & {
    border-color: var(--accent-dim);
  }
`

/* ─── Right controls group ───────────────────────────────────── */

const NavControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  pointer-events: all;
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

/* Language pill wrapper (relative for dropdown positioning) */
const LangWrapper = styled.div`
  position: relative;
`

/* Language pill button */
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

/* Language dropdown bubble */
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

/* ─── Hamburger (Framer Motion bars) ─────────────────────────── */

const HamburgerBtn = styled.button`
  pointer-events: all;
  position: relative;
  width: 28px;
  height: 20px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
`

const BAR_STYLE = {
  position: 'absolute',
  left: 0,
  height: '1.5px',
  background: 'var(--text-primary)',
  borderRadius: '2px',
  transformOrigin: 'center center',
}

/* ─── Black curtain (appears before MenuOverlay) ───────────── */

const MenuBlack = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 98;
  pointer-events: none;
`

/* ─── Full-screen overlay ───────────────────────────────────── */

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

/* ─── Left: nav links ────────────────────────────────────────── */

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

/* ─── Right: 2×2 social grid (Kumar-style) ──────────────────── */

const SocialGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  align-self: center;
  height: min(380px, 55vh);
  border: 1px solid var(--border);

  @media (max-width: 768px) { display: none; }
`

/* ─── Mobile: circles stacked vertically on the right ───────── */

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

/* Each cell */
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
  cursor: pointer;

  /* Background fill — expands from origin corner */
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

/* ─── Footer bar ─────────────────────────────────────────────── */

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
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
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
    href: 'mailto:iroky146@gmail.com',
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

/* ─── Component ──────────────────────────────────────────────── */

const LANG_OPTIONS = [
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'it', flag: '🇮🇹', label: 'Italiano' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'pt', flag: '🇧🇷', label: 'Português' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)
  const { dark, toggle: toggleTheme } = useThemeCtx()
  const { lang, t, setLang } = useLang()

  const menuLinks = [
    { label: t('nav_home'),     href: '/' },
    { label: t('nav_projects'), href: '/#projects' },
    { label: t('nav_about'),    href: '/about' },
    { label: t('nav_contact'),  href: 'mailto:iroky146@gmail.com', external: true },
  ]

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

  /* Close lang dropdown on click outside */
  useEffect(() => {
    if (!langOpen) return
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false)
      }
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

  return (
    <>
      <Nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <LogoBtn aria-label="Volver al inicio" onClick={scrollToTop}>
          <LogoCircle
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </LogoBtn>

        <NavControls>
          {/* ── Language selector ── */}
          <LangWrapper ref={langRef}>
            <LangBtn
              onClick={() => setLangOpen(v => !v)}
              aria-label="Seleccionar idioma"
            >
              <LangDot />
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
                      <span>{opt.flag}</span>
                      {opt.label}
                    </LangOption>
                  ))}
                </LangDropdown>
              )}
            </AnimatePresence>
          </LangWrapper>

          {/* ── Dark mode toggle ── */}
          <IconBtn
            onClick={toggleTheme}
            aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </IconBtn>

          {/* ── Hamburger ── */}
          <HamburgerBtn
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            <motion.span
              style={{ ...BAR_STYLE, width: '100%' }}
              animate={open
                ? { top: 9, rotate: 45, width: '100%' }
                : { top: 3, rotate: 0,  width: '100%' }
              }
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
            {/* ── Left: nav links ── */}
            <NavLinks>
              {menuLinks.map((link, i) => (
                <MenuItemWrapper key={link.label}>
                  <MenuItem
                    variants={itemVariant(i)}
                    initial="hidden"
                    animate="visible"
                    onClick={close}
                  >
                    {link.external
                      ? <a href={link.href}>{link.label}</a>
                      : <Link href={link.href}>{link.label}</Link>
                    }
                  </MenuItem>
                </MenuItemWrapper>
              ))}
            </NavLinks>

            {/* ── Right: 2×2 social grid (desktop) ── */}
            <SocialGrid
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
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

            {/* ── Right: circles stacked vertically (mobile) ── */}
            <MobileSocialStack
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
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

            {/* ── Footer ── */}
            <MenuFooter
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.35 }}
            >
              <MenuFooterText>mrmerlo.com</MenuFooterText>
              <MenuFooterText>{t('nav_location')}</MenuFooterText>
            </MenuFooter>
          </MenuOverlay>
        )}
      </AnimatePresence>
    </>
  )
}
