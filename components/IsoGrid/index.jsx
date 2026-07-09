import { useRef, useEffect } from 'react'
import styled from 'styled-components'

/* ──────────────────────────────────────────────────────────────
   Grilla isométrica en Canvas 2D (fondo del hero).
   - Bola que rebota de CENTRO a CENTRO de cada rombo (paridad par).
   - Rastro: cada rombo tocado se ilumina y se desvanece en 5 s.
   - Wrap-around por los bordes. Interacción atómica (termina el salto
     antes de redirigir). Feedback: glow al fijar, target-tile fijo al
     100 %, arrival burst (sunburst) y colapso concéntrico al interrumpir.
   - Máscara de fade inferior fuerte para fundir con la sección siguiente.
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

export default function IsoGrid() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let W = 0, H = 0, dpr = 1
    let originX = 0, originY = 0, Umax = 0, Vmax = 0
    let colAccent = '#A8E6C1', colBorder = '#D0E8DA', colBall = '#1A1A1A'

    const grid = document.createElement('canvas')
    const gctx = grid.getContext('2d')
    const trail = new Map()
    let raf = null

    const ball = { u: 0, v: 0, fromU: 0, fromV: 0, t0: 0, restT0: 0, du: 1, dv: 1, moving: true, bx: 0, by: 0 }
    let pinned = false
    let target = null            // {u,v} destino activo (se dibuja fijo al 100 %)
    let burst = null             // {cx,cy,t0,peak,collapsing,collapseStart}
    let bounceSign = 0           // detecta el "touchdown" del rebote en el sitio

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

    /* Interrumpe el arrival burst: colapsa hacia el centro de la bola */
    const collapseBurst = (now) => {
      if (burst && !burst.collapsing) { burst.collapsing = true; burst.collapseStart = now }
    }

    const drawBurst = (now) => {
      let cx, cy, spread, alpha
      if (burst.collapsing) {
        const c = (now - burst.collapseStart) / COLLAPSE_MS
        if (c >= 1) { burst = null; return }
        cx = ball.bx; cy = ball.by                       // retrae hacia la bola (viva)
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

    const draw = (now) => {
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(grid, 0, 0, W, H)

      // rastro con fade
      for (const [k, t] of trail) {
        const a = 1 - (now - t) / TRAIL_MS
        if (a <= 0) { trail.delete(k); continue }
        const [u, v] = k.split(',').map(Number)
        fillCell(u, v, a * 0.55)
      }

      // target activo → fijo al 100 % (sin fade hasta que la bola llegue)
      if (pinned && target) fillCell(target.u, target.v, 1)

      // movimiento de la bola (máquina de estados)
      if (ball.moving) {
        const p = Math.min(1, (now - ball.t0) / HOP_MS)
        ball.bx = cellX(ball.fromU) + (cellX(ball.u) - cellX(ball.fromU)) * p
        ball.by = cellY(ball.fromV) + (cellY(ball.v) - cellY(ball.fromV)) * p - Math.sin(p * Math.PI) * BOUNCE
        if (p >= 1) {
          ball.moving = false
          ball.restT0 = ball.t0 + HOP_MS          // la fase del rebote en el sitio arranca EN EL SUELO
          bounceSign = 0
          const hitTarget = pinned && sameCell(ball, target)
          trail.set(key(ball.u, ball.v), now)
          if (hitTarget) {
            burst = { cx: cellX(ball.u), cy: cellY(ball.v), t0: now, peak: 0, collapsing: false }
            target = null
          }
          if (!pinned) decideNext(now)            // autónomo: nuevo salto arranca desde el suelo
        }
      } else {
        // rebote en el sitio con la MISMA fase/frecuencia del salto (empieza en el suelo)
        const phase = (now - ball.restT0) * Math.PI / HOP_MS
        const sn = Math.sin(phase)
        ball.bx = cellX(ball.u)
        ball.by = cellY(ball.v) - Math.abs(sn) * BOUNCE
        trail.set(key(ball.u, ball.v), now)
        const sg = sn >= 0 ? 1 : -1
        if (sg !== bounceSign) {                  // TOUCHDOWN (offset Y = 0): sólo aquí cambia de estado
          bounceSign = sg
          if (!pinned) {
            decideNext(now)                        // reanuda autónomo desde el suelo
          } else if (target && !sameCell(ball, target)) {
            dirToTarget(); startHop(now)           // salto dirigido arranca desde el suelo
          } else {
            burst = { cx: cellX(ball.u), cy: cellY(ball.v), t0: now, peak: 0, collapsing: false } // destello por rebote
          }
        }
      }

      if (burst) drawBurst(now)

      // bola con glow (mayor al estar fija)
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
      ctx.arc(ball.bx, ball.by, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      raf = requestAnimationFrame(draw)
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
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const now = performance.now()

      if (Math.hypot(mx - ball.bx, my - ball.by) < HIT_R) {
        if (pinned) {                              // liberar
          pinned = false
          if (target) { trail.set(key(target.u, target.v), now); target = null }
          collapseBurst(now)
        } else {                                   // fijar
          pinned = true
          target = null
        }
        return
      }

      const cell = pickCell(mx, my)
      if (pinned) {
        if (target && !sameCell(target, cell)) trail.set(key(target.u, target.v), now) // el target anterior arranca su fade
        target = cell
        collapseBurst(now)                         // interrumpe el burst suavemente
      } else {
        trail.set(key(cell.u, cell.v), now)
      }
    }

    /* init */
    resize()
    ball.u = 0
    ball.v = Vmax - 2
    if ((ball.u + ball.v) & 1) ball.v -= 1
    ball.fromU = ball.u; ball.fromV = ball.v
    ball.du = 1; ball.dv = -1
    ball.moving = false
    ball.restT0 = performance.now()
    bounceSign = 0
    ball.bx = cellX(ball.u); ball.by = cellY(ball.v)

    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    canvas.addEventListener('pointerdown', onPointerDown)

    const themeObs = new MutationObserver(() => { readColors(); buildGrid() })
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    if (reduced) {
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(grid, 0, 0, W, H)
      ctx.fillStyle = colBall
      ctx.beginPath()
      ctx.arc(cellX(ball.u), cellY(ball.v), 7, 0, Math.PI * 2)
      ctx.fill()
    } else {
      raf = requestAnimationFrame(draw)
    }

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('pointerdown', onPointerDown)
      themeObs.disconnect()
    }
  }, [])

  return <Canvas ref={canvasRef} aria-hidden="true" />
}
