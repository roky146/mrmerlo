import { useEffect } from 'react'

/**
 * PageIntro — manages the #__page-intro div injected in _document.js.
 * That div is pure HTML/CSS so it appears before any JS loads (no FOUC).
 * This component only handles the curtain-up exit animation.
 */
export default function PageIntro() {
  useEffect(() => {
    const el = document.getElementById('__page-intro')
    if (!el) return

    // Already played this session → remove instantly
    if (sessionStorage.getItem('intro-played')) {
      el.remove()
      return
    }

    // Short hold (page visually black), then curtain slides up
    const holdTimer = setTimeout(() => {
      el.style.transition = 'clip-path 0.9s cubic-bezier(0.76, 0, 0.24, 1)'
      // Force reflow so the browser registers the transition before the state change
      void el.offsetHeight
      el.style.clipPath = 'inset(0 0 100% 0)'

      // Remove from DOM after animation + mark as played
      const removeTimer = setTimeout(() => {
        el.remove()
        sessionStorage.setItem('intro-played', '1')
      }, 950)

      return () => clearTimeout(removeTimer)
    }, 300)

    return () => clearTimeout(holdTimer)
  }, [])

  return null
}
