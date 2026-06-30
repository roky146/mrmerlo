import { useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from '../styles/theme'
import GlobalStyle from '../styles/GlobalStyle'
import Navbar from '../components/Navbar'
import Cursor from '../components/Cursor'
import PageIntro from '../components/PageIntro'
import { ThemeCtxProvider } from '../contexts/ThemeContext'
import { LanguageProvider } from '../contexts/LanguageContext'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function App({ Component, pageProps }) {
  useEffect(() => {
    let lenis

    const initLenis = async () => {
      try {
        const { default: Lenis } = await import('@studio-freight/lenis')

        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothTouch: false,
        })

        // Connect Lenis with GSAP ScrollTrigger — critical for parallax to work
        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.add((time) => { lenis.raf(time * 1000) })
        gsap.ticker.lagSmoothing(0)

        // Expose globally so Hero/other components can reference if needed
        window.__lenis__ = lenis

      } catch {
        document.documentElement.style.scrollBehavior = 'smooth'
      }
    }

    initLenis()

    return () => {
      if (lenis) {
        lenis.destroy()
        window.__lenis__ = null
      }
    }
  }, [])

  return (
    <ThemeCtxProvider>
      <LanguageProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <PageIntro />
          <Cursor />
          <Navbar />
          <Component {...pageProps} />
        </ThemeProvider>
      </LanguageProvider>
    </ThemeCtxProvider>
  )
}
