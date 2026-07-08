import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const Dot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-primary);
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: width 0.2s, height 0.2s, opacity 0.2s;
  will-change: transform;

  /* Hide on touch/coarse-pointer devices */
  @media (pointer: coarse) { display: none; }

  /* La bolita SIEMPRE persiste (antes desaparecía sobre botones). */
  &.hovering {
    width: 6px;
    height: 6px;
    background: var(--accent-dim);
  }
`

const Ring = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid var(--text-primary);
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: width 0.25s ease, height 0.25s ease, border-color 0.25s ease, opacity 0.2s;
  will-change: transform;

  /* Hide on touch/coarse-pointer devices */
  @media (pointer: coarse) { display: none; }

  &.hovering {
    width: 56px;
    height: 56px;
    border-color: var(--accent-dim);
  }

  &.clicking {
    width: 28px;
    height: 28px;
  }
`

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    // Only on pointer: fine (desktop)
    if (window.matchMedia('(pointer: coarse)').matches) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let rafId = null
    let isHovering = false
    let isClicking = false

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`
      }
    }

    const lerp = (a, b, t) => a + (b - a) * t

    const loop = () => {
      rx = lerp(rx, mx, 0.12)
      ry = lerp(ry, my, 0.12)
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`
      }
      rafId = requestAnimationFrame(loop)
    }

    const onEnter = () => {
      isHovering = true
      dotRef.current?.classList.add('hovering')
      ringRef.current?.classList.add('hovering')
    }

    const onLeave = () => {
      isHovering = false
      dotRef.current?.classList.remove('hovering')
      ringRef.current?.classList.remove('hovering')
    }

    const onDown = () => {
      isClicking = true
      ringRef.current?.classList.add('clicking')
    }

    const onUp = () => {
      isClicking = false
      ringRef.current?.classList.remove('clicking')
    }

    const addListeners = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    // Re-scan on DOM mutations (SPA navigation)
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    addListeners()
    rafId = requestAnimationFrame(loop)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  return (
    <div aria-hidden="true">
      <Dot ref={dotRef} />
      <Ring ref={ringRef} />
    </div>
  )
}
