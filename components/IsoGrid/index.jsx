import { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useLang } from '../../contexts/LanguageContext'

/* ──────────────────────────────────────────────────────────────
   Grilla isométrica en Canvas 2D (fondo del hero).
   - 3 bolas que rebotan de centro a centro con rastro y wrap-around.
   - Movimiento autónomo sesgado al centro (zona visible; bordes raros).
   - Celdas encendidas se ELEVAN (tile 3D: cara superior + laterales).
   - Ripple al click = onda física (anillo brillante que viaja y sube tiles).
   - Interacción por bola: fijar, pathfinding, destello (sunburst).
   - Pausa fuera del viewport / pestaña oculta. Hover glow. Hint 1ª visita.
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

  @keyframes gridHintPulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
  @keyframes gridHintIn { from { opacity: 0; transform: translate(-50%, 6px); } to { opacity: 0.85; transform: translate(-50%, 0); } }
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
const RIPPLE_MS_PER_RING = 70
const RIPPLE_SIGMA = 0.9
const RIPPLE_PEAK = 0.6
const RIPPLE_MAX = 5
const TILE_LIFT = 9      // elevación del tile del rastro/bola
const RIPPLE_LIFT = 13   // elevación del frente de la onda
const TARGET_LIFT = 11   // elevación del tile destino
const EDGE_BIAS = 0.5    // a partir de qué fracción del borde la bola vuelve al centro

export default function IsoGrid() {
  const canvasRef = useRef(null)
  const { t } = useLang()
  const [hintOn, setHintOn] = useState(false)
  const hintRef = useRef(false)
  const dismissRef = useRef(() => {})

  useEffect(() => { hintRef.current = hintOn }, [hintOn])

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
    let hover = null

    const makeBall = (u, v, du, dv) => ({
      u, v, fromU: u, fromV: v, t0: 0, restT0: 0, du, dv, moving: false,
      bx: 0, by: 0, h: 0, pinned: false, target: null, bounceSign: 0, burst: null,
    })
    const balls = []

    /* Reloj con compensación de pausa */
    let totalPaused = 0, pauseStart = 0, running = false, raf = null
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
      c.moveTo(x, y - ch2); c.lineTo(x + cw2, y); c.lineTo(x, y + ch2); c.lineTo(x - cw2, y)
      c.closePath()
    }

    const buildGrid = () => {
      grid.width = Math.max(1, W * dpr); grid.height = Math.max(1, H * dpr)
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
      canvas.width = Math.max(1, W * dpr); canvas.height = Math.max(1, H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      originX = W / 2; originY = H / 2
      Umax = Math.ceil((W / 2) / cw2) + 2
      Vmax = Math.ceil((H / 2) / ch2) + 2
      readColors(); buildGrid()
    }

    /* rombo plano (hover) */
    const fillCell = (u, v, alpha) => {
      ctx.globalAlpha = alpha
      ctx.fillStyle = colAccent
      diamondPath(ctx, cellX(u), cellY(v))
      ctx.fill()
      ctx.globalAlpha = 1
    }

    /* tile ELEVADO: cara superior (rombo subido e) + 2 caras laterales sombreadas */
    const fillRaised = (u, v, opacity, e) => {
      const x = cellX(u), y = cellY(v)
      ctx.fillStyle = colAccent
      // cara izquierda (sombra)
      ctx.globalAlpha = opacity * 0.36
      ctx.beginPath()
      ctx.moveTo(x - cw2, y); ctx.lineTo(x, y + ch2); ctx.lineTo(x, y + ch2 - e); ctx.lineTo(x - cw2, y - e); ctx.closePath(); ctx.fill()
      // cara derecha
      ctx.globalAlpha = opacity * 0.6
      ctx.beginPath()
      ctx.moveTo(x + cw2, y); ctx.lineTo(x, y + ch2); ctx.lineTo(x, y + ch2 - e); ctx.lineTo(x + cw2, y - e); ctx.closePath(); ctx.fill()
      // cara superior
      ctx.globalAlpha = opacity
      ctx.beginPath()
      ctx.moveTo(x, y - e - ch2); ctx.lineTo(x + cw2, y - e); ctx.lineTo(x, y - e + ch2); ctx.lineTo(x - cw2, y - e); ctx.closePath(); ctx.fill()
      ctx.globalAlpha = 1
    }

    /* elevación viva de una celda del rastro (para que la bola monte su tile) */
    const elevAt = (u, v, now) => {
      const tt = trail.get(key(u, v))
      if (tt === undefined) return 0
      const a = 1 - (now - tt) / TRAIL_MS
      return a > 0 ? TILE_LIFT * a : 0
    }
    const ground = (u, v, now) => cellY(v) - elevAt(u, v, now)

    /* ── Ripple (onda física) ── */
    const eachRingCell = (cu, cv, d, cb) => {
      if (d === 0) { cb(cu, cv); return }
      for (let du = -d; du <= d; du++) {
        for (let dv = -d; dv <= d; dv++) {
          if (Math.max(Math.abs(du), Math.abs(dv)) !== d) continue
          if ((du + dv) & 1) continue
          cb(cu + du, cv + dv)
        }
      }
    }
    const spawnRipple = (cu, cv, now) => { ripples.push({ cu, cv, t0: now }) }
    const drawRipples = (now) => {
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]
        const front = (now - rp.t0) / RIPPLE_MS_PER_RING
        if (front > RIPPLE_MAX + 2.5) { ripples.splice(i, 1); continue }
        const energy = Math.max(0, 1 - front / (RIPPLE_MAX + 1))
        const lo = Math.max(0, Math.floor(front - 2))
        const hi = Math.min(RIPPLE_MAX, Math.ceil(front + 2))
        for (let d = lo; d <= hi; d++) {
          const off = d - front
          const g = Math.exp(-(off * off) / (2 * RIPPLE_SIGMA * RIPPLE_SIGMA))
          const intensity = g * energy
          const alpha = intensity * RIPPLE_PEAK
          if (alpha < 0.02) continue
          eachRingCell(rp.cu, rp.cv, d, (u, v) => fillRaised(u, v, alpha, RIPPLE_LIFT * intensity))
        }
      }
    }

    /* ── Lógica de una bola ── */
    const nextDir = (b) => {
      let biased = false
      if (Math.abs(b.u) > Umax * EDGE_BIAS && Math.random() < 0.7) { b.du = b.u > 0 ? -1 : 1; biased = true }
      if (Math.abs(b.v) > Vmax * EDGE_BIAS && Math.random() < 0.7) { b.dv = b.v > 0 ? -1 : 1; biased = true }
      if (!biased && Math.random() < 0.28) {
        if (Math.random() < 0.5) b.du = -b.du
        else b.dv = -b.dv
      }
    }
    const dirToTarget = (b) => {
      const du = b.target.u - b.u, dv = b.target.v - b.v
      b.du = du > 0 ? 1 : du < 0 ? -1 : (b.u >= Umax ? -1 : 1)
      b.dv = dv > 0 ? 1 : dv < 0 ? -1 : (b.v >= Vmax ? -1 : 1)
    }
    const startHop = (b, now) => {
      b.fromU = b.u; b.fromV = b.v
      let nu = b.u + b.du, nv = b.v + b.dv, ou = 0, ov = 0
      if (nu > Umax) ou = -2 * Umax; else if (nu < -Umax) ou = 2 * Umax
      if (nv > Vmax) ov = -2 * Vmax; else if (nv < -Vmax) ov = 2 * Vmax
      if (ou || ov) { b.fromU += ou; b.fromV += ov; nu += ou; nv += ov }
      b.u = nu; b.v = nv; b.t0 = now; b.moving = true
    }
    const decideNext = (b, now) => {
      if (!b.pinned) { nextDir(b); startHop(b, now); return }
      if (b.target && !sameCell(b, b.target)) { dirToTarget(b); startHop(b, now) }
    }
    const collapseBurst = (b, now) => {
      if (b.burst && !b.burst.collapsing) { b.burst.collapsing = true; b.burst.collapseStart = now }
    }

    const updateBall = (b, now) => {
      if (b.moving) {
        const p = Math.min(1, (now - b.t0) / HOP_MS)
        b.h = Math.sin(p * Math.PI)
        b.bx = cellX(b.fromU) + (cellX(b.u) - cellX(b.fromU)) * p
        const gy = ground(b.fromU, b.fromV, now) + (ground(b.u, b.v, now) - ground(b.fromU, b.fromV, now)) * p
        b.by = gy - b.h * BOUNCE
        if (p >= 1) {
          b.moving = false; b.restT0 = b.t0 + HOP_MS; b.bounceSign = 0
          const hitTarget = b.pinned && sameCell(b, b.target)
          trail.set(key(b.u, b.v), now)
          if (hitTarget) { b.burst = { cx: cellX(b.u), cy: cellY(b.v), t0: now, peak: 0, collapsing: false }; b.target = null }
          if (!b.pinned) decideNext(b, now)
        }
      } else {
        const phase = (now - b.restT0) * Math.PI / HOP_MS
        const sn = Math.sin(phase)
        b.h = Math.abs(sn)
        trail.set(key(b.u, b.v), now)
        b.bx = cellX(b.u)
        b.by = ground(b.u, b.v, now) - b.h * BOUNCE
        const sg = sn >= 0 ? 1 : -1
        if (sg !== b.bounceSign) {
          b.bounceSign = sg
          if (!b.pinned) decideNext(b, now)
          else if (b.target && !sameCell(b, b.target)) { dirToTarget(b); startHop(b, now) }
          else b.burst = { cx: cellX(b.u), cy: cellY(b.v), t0: now, peak: 0, collapsing: false }
        }
      }
    }

    const drawBurst = (b, now) => {
      const bu = b.burst
      let cx, cy, spread, alpha
      if (bu.collapsing) {
        const c = (now - bu.collapseStart) / COLLAPSE_MS
        if (c >= 1) { b.burst = null; return }
        cx = b.bx; cy = b.by
        spread = BURST_R * (bu.peak || 1) * (1 - c)
        alpha = (1 - c) * 0.85
      } else {
        const p = (now - bu.t0) / BURST_MS
        if (p >= 1) { b.burst = null; return }
        bu.peak = p; cx = bu.cx; cy = bu.cy
        spread = BURST_R * p
        alpha = (1 - p) * 0.9
      }
      ctx.save()
      ctx.strokeStyle = colAccent; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.globalAlpha = alpha
      for (let i = 0; i < RAYS; i++) {
        const a = (i / RAYS) * Math.PI * 2
        const dx = Math.cos(a), dy = Math.sin(a) * 0.55
        ctx.beginPath()
        ctx.moveTo(cx + dx * spread * 0.42, cy + dy * spread * 0.42)
        ctx.lineTo(cx + dx * spread, cy + dy * spread)
        ctx.stroke()
      }
      ctx.restore()
    }

    const drawBall = (b) => {
      const sx = 1.28 - 0.38 * b.h
      const sy = 0.72 + 0.40 * b.h
      ctx.save()
      ctx.shadowColor = colAccent
      ctx.shadowBlur = b.pinned ? 34 : 12
      if (b.pinned) {
        ctx.globalAlpha = 0.22; ctx.fillStyle = colAccent
        ctx.beginPath(); ctx.arc(b.bx, b.by, 15, 0, Math.PI * 2); ctx.fill()
        ctx.globalAlpha = 1
      }
      ctx.fillStyle = colBall
      ctx.beginPath(); ctx.ellipse(b.bx, b.by, 7 * sx, 7 * sy, 0, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    }

    const draw = () => {
      const now = clock()

      // 1) actualizar estado de cada bola
      for (const b of balls) updateBall(b, now)

      // 2) render
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(grid, 0, 0, W, H)

      if (hover) fillCell(hover.u, hover.v, 0.16)

      // rastro (tiles elevados)
      for (const [k, tt] of trail) {
        const a = 1 - (now - tt) / TRAIL_MS
        if (a <= 0) { trail.delete(k); continue }
        const [u, v] = k.split(',').map(Number)
        fillRaised(u, v, a * 0.55, TILE_LIFT * a)
      }

      // ondas del click
      drawRipples(now)

      // tiles destino (fijos al 100 %, elevados)
      for (const b of balls) if (b.pinned && b.target) fillRaised(b.target.u, b.target.v, 1, TARGET_LIFT)

      // bursts
      for (const b of balls) if (b.burst) drawBurst(b, now)

      // pulso del hint alrededor de cada bola
      if (hintRef.current) {
        const hp = (now % 1500) / 1500
        ctx.save()
        ctx.strokeStyle = colAccent; ctx.globalAlpha = (1 - hp) * 0.6; ctx.lineWidth = 2
        for (const b of balls) { ctx.beginPath(); ctx.arc(b.bx, b.by, 9 + hp * 20, 0, Math.PI * 2); ctx.stroke() }
        ctx.restore()
      }

      // bolas
      for (const b of balls) drawBall(b)

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
      const uf = (mx - originX) / cw2, vf = (my - originY) / ch2
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
      const mx = e.clientX - rect.left, my = e.clientY - rect.top
      const now = clock()

      // ¿tocó alguna bola? (la más cercana dentro del radio)
      let hit = null, hd = HIT_R
      for (const b of balls) {
        const d = Math.hypot(mx - b.bx, my - b.by)
        if (d < hd) { hd = d; hit = b }
      }
      if (hit) {
        if (hit.pinned) {
          hit.pinned = false
          if (hit.target) { trail.set(key(hit.target.u, hit.target.v), now); hit.target = null }
          collapseBurst(hit, now)
        } else { hit.pinned = true; hit.target = null }
        return
      }

      const cell = pickCell(mx, my)
      const pinnedBalls = balls.filter(b => b.pinned)
      if (pinnedBalls.length) {
        for (const b of pinnedBalls) {
          if (b.target && !sameCell(b.target, cell)) trail.set(key(b.target.u, b.target.v), now)
          b.target = { u: cell.u, v: cell.v }
          collapseBurst(b, now)
        }
      } else {
        spawnRipple(cell.u, cell.v, now)
      }
    }

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      hover = pickCell(e.clientX - rect.left, e.clientY - rect.top)
    }
    const onPointerLeave = () => { hover = null }

    /* init */
    resize()
    const spawns = [
      { u: -Math.round(Umax * 0.30), v: -Math.round(Vmax * 0.14), du: 1, dv: 1 },
      { u: Math.round(Umax * 0.16), v: Math.round(Vmax * 0.24), du: -1, dv: 1 },
      { u: Math.round(Umax * 0.04), v: -Math.round(Vmax * 0.30), du: 1, dv: -1 },
    ]
    for (const s of spawns) {
      let { u, v } = s
      if ((u + v) & 1) v += 1
      const b = makeBall(u, v, s.du, s.dv)
      b.restT0 = clock(); b.bx = cellX(u); b.by = cellY(v)
      balls.push(b)
    }

    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    canvas.addEventListener('pointerdown', onPointerDown)
    if (canHover) {
      canvas.addEventListener('pointermove', onPointerMove)
      canvas.addEventListener('pointerleave', onPointerLeave)
    }

    const themeObs = new MutationObserver(() => { readColors(); buildGrid() })
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    let inView = true
    const decide = () => { if (inView && !document.hidden) start(); else stop() }
    const io = new IntersectionObserver((entries) => { inView = entries[0].isIntersecting; decide() }, { threshold: 0 })
    io.observe(canvas)
    document.addEventListener('visibilitychange', decide)

    if (reduced) {
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(grid, 0, 0, W, H)
      ctx.fillStyle = colBall
      for (const b of balls) { ctx.beginPath(); ctx.arc(cellX(b.u), cellY(b.v), 7, 0, Math.PI * 2); ctx.fill() }
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
