import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`

const MAX_DIST    = 120
const MOUSE_PULL  = 180
const SPEED       = 0.75
const DOT_RADIUS  = 2.5

export default function ParticleNet() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let w, h, dots, rafId
    const mouse = { x: -9999, y: -9999 }

    /* ── Dot count based on screen width (performance on mobile) ── */
    const getDotCount = () => window.innerWidth < 768 ? 24 : 48

    /* ── Accent color — cached, updated only on theme change ── */
    let accentColor = '#52B788'
    const refreshAccent = () => {
      const s = getComputedStyle(document.documentElement)
      accentColor = s.getPropertyValue('--accent').trim() || '#52B788'
    }

    /* ── init / resize ── */
    const init = () => {
      w = canvas.width  = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
      refreshAccent()

      const count = getDotCount()
      dots = Array.from({ length: count }, () => ({
        x:  Math.random() * w,
        y:  Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
      }))
    }

    /* ── draw frame ── */
    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      /* update positions */
      for (const d of dots) {
        /* mouse repulsion */
        const dx = d.x - mouse.x
        const dy = d.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_PULL && dist > 0) {
          const force = (MOUSE_PULL - dist) / MOUSE_PULL * 0.6
          d.vx += (dx / dist) * force
          d.vy += (dy / dist) * force
        }

        /* dampen + drift */
        d.vx *= 0.985
        d.vy *= 0.985
        d.vx += (Math.random() - 0.5) * 0.02
        d.vy += (Math.random() - 0.5) * 0.02

        d.x += d.vx
        d.y += d.vy

        /* wrap edges */
        if (d.x < 0)  d.x = w
        if (d.x > w)  d.x = 0
        if (d.y < 0)  d.y = h
        if (d.y > h)  d.y = 0
      }

      /* draw connections */
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx   = dots[i].x - dots[j].x
          const dy   = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.9
            ctx.strokeStyle = accentColor
            ctx.globalAlpha = alpha
            ctx.lineWidth   = 1
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.stroke()
          }
        }
      }

      /* draw dots */
      ctx.globalAlpha = 1
      ctx.fillStyle   = accentColor
      for (const d of dots) {
        ctx.beginPath()
        ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      rafId = requestAnimationFrame(draw)
    }

    /* ── mouse tracking ── */
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }

    /* ── resize observer ── */
    const ro = new ResizeObserver(() => { init() })
    ro.observe(canvas)

    /* ── theme change — refresh cached accent color ── */
    const mo = new MutationObserver(() => { refreshAccent() })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)

    init()
    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      ro.disconnect()
      mo.disconnect()
    }
  }, [])

  return <Canvas ref={canvasRef} aria-hidden="true" />
}
