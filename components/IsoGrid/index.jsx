import { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useLang } from '../../contexts/LanguageContext'

/* ──────────────────────────────────────────────────────────────
   Grilla isométrica en Canvas 2D (fondo del hero).
   Bola que rebota de centro a centro con rastro, wrap-around,
   pathfinding y destello (sunburst). Plus:
   - Pausa el rAF fuera del viewport / con la pestaña oculta (rendimiento).
   - Glow en la celda bajo el cursor (hover, en dispositivos con hover).
   - Hint de primera visita (pulso en la bola + chip) que se descarta al 1er toque.
   - Squash & stretch de la bola al rebotar.
   ────────────────────────────────────────────────────────────── */

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: auto;
  touch-action: manipulation;
  -webkit-mask-image: linear-gradient(to bottom, #000 85%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 85%, transparent 100%);
`

const Hint = styled.div`
  position: absolute;
  left: 50%;
  bottom: 15%;
  transform: translateX(-50%);
  z-index: 4;
  pointer-events: none;
  white-space: nowrap;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--accent-dim);
  background: rgba(var(--nav-bg-rgb, 240, 250, 244), 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: var(--text-secondary);
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.05em;
  animation: gridHintPulse 2.4s ease-in-out infinite, gridHintIn 0.5s ease-out;

  @keyframes gridHintPulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
  @keyframes gridHintIn {
    from { opacity: 0; transform: translate(-50%, 6px); }
    to   { opacity: 0.85; transform: translate(-50%, 0); }
  }
  @media (max-width: 480px) { font-size: 0.66rem; bottom: 12%; }
`

const CW = 64, CH = 32
const cw2 = CW / 2, ch2 = CH / 2
const TRAIL_MS = 5000
const HOP_MS = 380
const BOUNCE = 14
const HIT_R = 26
const BURST_MS = 650
const COLLAPSE_MS = 300
const BURST_R = 38
const RAYS = 12
const RING_MS = 55       // retardo entre anillos del ripple
const MAX_RINGS = 4      // alcance del ripple (distancia en celdas)

export default function IsoGrid() {
  const canvasRef = useRef(null)
  const { t } = useLang()
  const [hintOn, setHintOn] = useState(false)
  const hintRef = useRef(false)
  const dismissRef = useRef(() => {})

  useEffect(() => { hintRef.current = hintOn }, [hintOn])

  /* Hint de primera visita */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dismiss = () => {
      hintRef.current = false
      setHintOn(false)
      try { localStorage.setItem('gridHintSeen', '1') } catch (e) {}
    }
    dismissRef.current = dismiss
    let seen = true
    try { seen = !!localStorage.getItem('gridHintSeen') } catch (e) {}
    if (!seen && !reduced) setHintOn(true)
    const to = setTimeout(dismiss, 8000)
    return () => clearTimeout(to)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canHover = window.matchMedia('(hover: hover)').matches

    let W = 0, H = 0, dpr = 1
    let originX = 0, originY = 0, Umax = 0, Vmax = 0
    let colAccent = '#A8E6C1', colBorder = '#D0E8DA', colBall = '#1A1A1A'

    const grid = document.createElement('canvas')
    const gctx = grid.getContext('2d')
    const trail = new Map()
    const ripples = []

    const ball = { u: 0, v: 0, fromU: 0, fromV: 0, t0: 0, restT0: 0, du: 1, dv: 1, moving: true, bx: 0, by: 0, h: 0 }
    let pinned = false
    let target = null
    let burst = null
    let bounceSign = 0
    let hover = null

    /* Reloj con compensación de pausa (mantiene continuidad al reanudar) */
    let totalPaused = 0
    let pauseStart = 0
    let running = false
    let raf = null
    const clock = () => performance.now() - totalPaused

    const cellX = (u) => originX + u * cw2
    const cellY = (v) => originY + v * ch2
    const key = (u, v) => u + ',' + v
    const sameCell = (a, b) => a && b && a.u === b.u && a.v === b.v

    const readColors = () => {
      const s = getComputedStyle(document.documentElement)
      colAccent = (s.getPropertyValue('--accent') || '#A8E6C1').trim()
      colBorder = (s.getPropertyValue('--border') || '#D0E8DA').trim()
      colBall = (s.getPropertyValue('--text-primary') || '#1A1A1A').trim()
    }

    const diamondPath = (c, x, y) => {
      c.beginPath()
      c.moveTo(x, y - ch2)
      c.lineTo(x + cw2, y)
      c.lineTo(x, y + ch2)
      c.lineTo(x - cw2, y)
      c.closePath()
    }

    const buildGrid = () => {
      grid.width = Math.max(1, W * dpr)
      grid.height = Math.max(1, H * dpr)
      gctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      gctx.clearRect(0, 0, W, H)
      gctx.strokeStyle = colBorder
      gctx.globalAlpha = 0.35
      gctx.lineWidth = 1
      for (let u = -Umax; u <= Umax; u++) {
        for (let v = -Vmax; v <= Vmax; v++) {
          if ((u + v) & 1) continue
          diamondPath(gctx, cellX(u), cellY(v))
          gctx.stroke()
        }
      }
      gctx.globalAlpha = 1
    }

    const resize = () => {
      W = canvas.clientWidth || window.innerWidth
      H = canvas.clientHeight || window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, W * dpr)
      canvas.height = Math.max(1, H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      originX = W / 2
      originY = H / 2
      Umax = Math.ceil((W / 2) / cw2) + 2
      Vmax = Math.ceil((H / 2) / ch2) + 2
      readColors()
      buildGrid()
    }

    const fillCell = (u, v, alpha) => {
      ctx.globalAlpha = alpha
      ctx.fillStyle = colAccent
      diamondPath(ctx, cellX(u), cellY(v))
      ctx.fill()
      ctx.globalAlpha = 1
    }

    /* Ripple: onda que se propaga en anillos a los vecinos y luego se desvanece */
    const lightRing = (cu, cv, r, now) => {
      if (r === 0) { trail.set(key(cu, cv), now); return }
      for (let du = -r; du <= r; du++) {
        for (let dv = -r; dv <= r; dv++) {
          if (Math.max(Math.abs(du), Math.abs(dv)) !== r) continue
          if ((du + dv) & 1) continue
          trail.set(key(cu + du, cv + dv), now)
        }
      }
    }
    const spawnRipple = (cu, cv, now) => { ripples.push({ cu, cv, t0: now, lastRing: -1 }) }
    const processRipples = (now) => {
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]
        const upto = Math.min(Math.floor((now - rp.t0) / RING_MS), MAX_RINGS)
        for (let r = rp.lastRing + 1; r <= upto; r++) lightRing(rp.cu, rp.cv, r, now)
        rp.lastRing = upto
        if (rp.lastRing >= MAX_RINGS) ripples.splice(i, 1)
      }
    }

    const nextDir = () => {
      if (Math.random() < 0.28) {
        if (Math.random() < 0.5) ball.du = -ball.du
        else ball.dv = -ball.dv
      }
    }

    const dirToTarget = () => {
      const du = target.u - ball.u
      const dv = target.v - ball.v
      ball.du = du > 0 ? 1 : du < 0 ? -1 : (ball.u >= Umax ? -1 : 1)
      ball.dv = dv > 0 ? 1 : dv < 0 ? -1 : (ball.v >= Vmax ? -1 : 1)
    }

    const startHop = (now) => {
      ball.fromU = ball.u
      ball.fromV = ball.v
      let nu = ball.u + ball.du
      let nv = ball.v + ball.dv
      let ou = 0, ov = 0
      if (nu > Umax) ou = -2 * Umax; else if (nu < -Umax) ou = 2 * Umax
      if (nv > Vmax) ov = -2 * Vmax; else if (nv < -Vmax) ov = 2 * Vmax
      if (ou || ov) { ball.fromU += ou; ball.fromV += ov; nu += ou; nv += ov }
      ball.u = nu; ball.v = nv
      ball.t0 = now
      ball.moving = true
    }

    const decideNext = (now) => {
      if (!pinned) { nextDir(); startHop(now); return }
      if (target && !sameCell(ball, target)) { dirToTarget(); startHop(now) }
    }

    const collapseBurst = (now) => {
      if (burst && !burst.collapsing) { burst.collapsing = true; burst.collapseStart = now }
    }

    const drawBurst = (now) => {
      let cx, cy, spread, alpha
      if (burst.collapsing) {
        const c = (now - burst.collapseStart) / COLLAPSE_MS
        if (c >= 1) { burst = null; return }
        cx = ball.bx; cy = ball.by
        spread = BURST_R * (burst.peak || 1) * (1 - c)
        alpha = (1 - c) * 0.85
      } else {
        const p = (now - burst.t0) / BURST_MS
        if (p >= 1) { burst = null; return }
        burst.peak = p
        cx = burst.cx; cy = burst.cy
        spread = BURST_R * p
        alpha = (1 - p) * 0.9
      }
      ctx.save()
      ctx.strokeStyle = colAccent
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.globalAlpha = alpha
      for (let i = 0; i < RAYS; i++) {
        const a = (i / RAYS) * Math.PI * 2
        const dx = Math.cos(a), dy = Math.sin(a) * 0.55
        const inner = spread * 0.42, outer = spread
        ctx.beginPath()
        ctx.moveTo(cx + dx * inner, cy + dy * inner)
        ctx.lineTo(cx + dx * outer, cy + dy * outer)
        ctx.stroke()
      }
      ctx.restore()
    }

    const draw = () => {
      const now = clock()
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(grid, 0, 0, W, H)

      // glow suave en la celda bajo el cursor
      if (hover) fillCell(hover.u, hover.v, 0.16)

      // ripples activos → encienden anillos hacia los vecinos
      processRipples(now)

      // rastro con fade
      for (const [k, tt] of trail) {
        const a = 1 - (now - tt) / TRAIL_MS
        if (a <= 0) { trail.delete(k); continue }
        const [u, v] = k.split(',').map(Number)
        fillCell(u, v, a * 0.55)
      }

      // target activo fijo al 100 %
      if (pinned && target) fillCell(target.u, target.v, 1)

      if (ball.moving) {
        const p = Math.min(1, (now - ball.t0) / HOP_MS)
        ball.h = Math.sin(p * Math.PI)
        ball.bx = cellX(ball.fromU) + (cellX(ball.u) - cellX(ball.fromU)) * p
        ball.by = cellY(ball.fromV) + (cellY(ball.v) - cellY(ball.fromV)) * p - ball.h * BOUNCE
        if (p >= 1) {
          ball.moving = false
          ball.restT0 = ball.t0 + HOP_MS
          bounceSign = 0
          const hitTarget = pinned && sameCell(ball, target)
          trail.set(key(ball.u, ball.v), now)
          if (hitTarget) { burst = { cx: cellX(ball.u), cy: cellY(ball.v), t0: now, peak: 0, collapsing: false }; target = null }
          if (!pinned) decideNext(now)
        }
      } else {
        const phase = (now - ball.restT0) * Math.PI / HOP_MS
        const sn = Math.sin(phase)
        ball.h = Math.abs(sn)
        ball.bx = cellX(ball.u)
        ball.by = cellY(ball.v) - ball.h * BOUNCE
        trail.set(key(ball.u, ball.v), now)
        const sg = sn >= 0 ? 1 : -1
        if (sg !== bounceSign) {
          bounceSign = sg
          if (!pinned) decideNext(now)
          else if (target && !sameCell(ball, target)) { dirToTarget(); startHop(now) }
          else burst = { cx: cellX(ball.u), cy: cellY(ball.v), t0: now, peak: 0, collapsing: false }
        }
      }

      if (burst) drawBurst(now)

      // pulso del hint alrededor de la bola
      if (hintRef.current) {
        const hp = (now % 1500) / 1500
        ctx.save()
        ctx.strokeStyle = colAccent
        ctx.globalAlpha = (1 - hp) * 0.7
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(ball.bx, ball.by, 9 + hp * 20, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }

      // bola con squash & stretch + glow
      const sx = 1.28 - 0.38 * ball.h
      const sy = 0.72 + 0.40 * ball.h
      ctx.save()
      ctx.shadowColor = colAccent
      ctx.shadowBlur = pinned ? 34 : 12
      if (pinned) {
        ctx.globalAlpha = 0.22
        ctx.fillStyle = colAccent
        ctx.beginPath()
        ctx.arc(ball.bx, ball.by, 15, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }
      ctx.fillStyle = colBall
      ctx.beginPath()
      ctx.ellipse(ball.bx, ball.by, 7 * sx, 7 * sy, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      raf = requestAnimationFrame(draw)
    }

    const start = () => {
      if (running || reduced) return
      running = true
      if (pauseStart) { totalPaused += performance.now() - pauseStart; pauseStart = 0 }
      raf = requestAnimationFrame(draw)
    }
    const stop = () => {
      if (!running) return
      running = false
      if (raf) cancelAnimationFrame(raf)
      raf = null
      pauseStart = performance.now()
    }

    const pickCell = (mx, my) => {
      const uf = (mx - originX) / cw2
      const vf = (my - originY) / ch2
      let u = Math.round(uf), v = Math.round(vf)
      if ((u + v) & 1) {
        if (Math.abs(uf - u) > Math.abs(vf - v)) u += uf > u ? 1 : -1
        else v += vf > v ? 1 : -1
      }
      return { u, v }
    }

    const onPointerDown = (e) => {
      if (hintRef.current) dismissRef.current()
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const now = clock()
      if (Math.hypot(mx - ball.bx, my - ball.by) < HIT_R) {
        if (pinned) { pinned = false; if (target) { trail.set(key(target.u, target.v), now); target = null } collapseBurst(now) }
        else { pinned = true; target = null }
        return
      }
      const cell = pickCell(mx, my)
      if (pinned) {
        if (target && !sameCell(target, cell)) trail.set(key(target.u, target.v), now)
        target = cell
        collapseBurst(now)
      } else {
        spawnRipple(cell.u, cell.v, now)   // onda expansiva desde la celda tocada
      }
    }

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      hover = pickCell(e.clientX - rect.left, e.clientY - rect.top)
    }
    const onPointerLeave = () => { hover = null }

    /* init */
    resize()
    ball.u = 0
    ball.v = Vmax - 2
    if ((ball.u + ball.v) & 1) ball.v -= 1
    ball.fromU = ball.u; ball.fromV = ball.v
    ball.du = 1; ball.dv = -1
    ball.moving = false
    ball.restT0 = clock()
    bounceSign = 0
    ball.bx = cellX(ball.u); ball.by = cellY(ball.v)

    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    canvas.addEventListener('pointerdown', onPointerDown)
    if (canHover) {
      canvas.addEventListener('pointermove', onPointerMove)
      canvas.addEventListener('pointerleave', onPointerLeave)
    }

    const themeObs = new MutationObserver(() => { readColors(); buildGrid() })
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    // Pausa fuera del viewport / con la pestaña oculta
    let inView = true
    const decide = () => { if (inView && !document.hidden) start(); else stop() }
    const io = new IntersectionObserver((entries) => { inView = entries[0].isIntersecting; decide() }, { threshold: 0 })
    io.observe(canvas)
    document.addEventListener('visibilitychange', decide)

    if (reduced) {
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(grid, 0, 0, W, H)
      ctx.fillStyle = colBall
      ctx.beginPath()
      ctx.arc(cellX(ball.u), cellY(ball.v), 7, 0, Math.PI * 2)
      ctx.fill()
    } else {
      start()
    }

    return () => {
      stop()
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', decide)
      io.disconnect()
      themeObs.disconnect()
    }
  }, [])

  return (
    <>
      <Canvas ref={canvasRef} aria-hidden="true" />
      {hintOn && <Hint aria-hidden="true">{t('grid_hint')}</Hint>}
    </>
  )
}
