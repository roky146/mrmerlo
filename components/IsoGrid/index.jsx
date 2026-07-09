import { useRef, useEffect } from 'react'
import styled from 'styled-components'

/* ──────────────────────────────────────────────────────────────
   Grilla isométrica en Canvas 2D (fondo del hero).
   - Una bola rebota de cuadro en cuadro siguiendo caminos continuos.
   - Cada cuadro que toca se ilumina (acento) y se desvanece en 5 s.
   - Wrap-around: si sale por un borde, reaparece por el opuesto.
   - Interacción: click en celda vacía → ilumina; click en la bola → la fija;
     con la bola fija, click en otra celda → pathfinding hasta allí.
   Todo con una sola grilla pre-renderizada + rAF ligero.
   ────────────────────────────────────────────────────────────── */

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: auto;
  touch-action: manipulation;
`

const CW = 64, CH = 32          // tamaño del rombo
const cw2 = CW / 2, ch2 = CH / 2
const TRAIL_MS = 5000           // duración del rastro
const HOP_MS = 380              // duración de un salto
const BOUNCE = 14               // altura del rebote

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

    const trail = new Map()          // "u,v" -> timestamp
    let raf = null

    /* Estado de la bola (en coords de celda u,v — u controla X, v controla Y) */
    const ball = { u: 0, v: 2 * Math.max(1, 0), fromU: 0, fromV: 0, t0: 0, du: 1, dv: 1 }
    let pinned = false
    let target = null                // {u,v} destino cuando está fija

    const cellX = (u) => originX + u * cw2
    const cellY = (v) => originY + v * ch2
    const key = (u, v) => u + ',' + v

    const readColors = () => {
      const s = getComputedStyle(document.documentElement)
      colAccent = (s.getPropertyValue('--accent') || '#A8E6C1').trim()
      colBorder = (s.getPropertyValue('--border') || '#D0E8DA').trim()
      colBall = (s.getPropertyValue('--text-primary') || '#1A1A1A').trim()
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
          const x = cellX(u), y = cellY(v)
          gctx.beginPath()
          gctx.moveTo(x, y - ch2)
          gctx.lineTo(x + cw2, y)
          gctx.lineTo(x, y + ch2)
          gctx.lineTo(x - cw2, y)
          gctx.closePath()
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

    /* Rombo relleno (rastro) */
    const fillCell = (u, v, alpha) => {
      const x = cellX(u), y = cellY(v)
      ctx.globalAlpha = alpha
      ctx.fillStyle = colAccent
      ctx.beginPath()
      ctx.moveTo(x, y - ch2)
      ctx.lineTo(x + cw2, y)
      ctx.lineTo(x, y + ch2)
      ctx.lineTo(x - cw2, y)
      ctx.closePath()
      ctx.fill()
      ctx.globalAlpha = 1
    }

    /* Elegir la próxima dirección autónoma (gira 90° a veces, sin retroceder) */
    const nextDir = () => {
      if (Math.random() < 0.28) {
        if (Math.random() < 0.5) ball.du = -ball.du
        else ball.dv = -ball.dv
      }
    }

    /* Dirección hacia el destino (pathfinding greedy, óptimo en grilla libre) */
    const dirToTarget = () => {
      const du = target.u - ball.u
      const dv = target.v - ball.v
      ball.du = du > 0 ? 1 : du < 0 ? -1 : (ball.u >= Umax ? -1 : 1)
      ball.dv = dv > 0 ? 1 : dv < 0 ? -1 : (ball.v >= Vmax ? -1 : 1)
    }

    /* Iniciar el próximo salto desde la celda actual */
    const startHop = (now) => {
      ball.fromU = ball.u
      ball.fromV = ball.v
      let nu = ball.u + ball.du
      let nv = ball.v + ball.dv
      // wrap-around: si el destino sale del área, teletransporta al lado opuesto
      let ou = 0, ov = 0
      if (nu > Umax) ou = -2 * Umax; else if (nu < -Umax) ou = 2 * Umax
      if (nv > Vmax) ov = -2 * Vmax; else if (nv < -Vmax) ov = 2 * Vmax
      if (ou || ov) {
        ball.fromU += ou; ball.fromV += ov
        nu += ou; nv += ov
      }
      ball.u = nu; ball.v = nv
      ball.t0 = now
    }

    /* Llegada a una celda: encender rastro y decidir el siguiente movimiento */
    const arrive = (now) => {
      trail.set(key(ball.u, ball.v), now)
      if (pinned) {
        if (target && ball.u === target.u && ball.v === target.v) target = null
        if (target) { dirToTarget(); startHop(now) }
        // si no hay target, se queda rebotando en el sitio (sin hop)
      } else {
        nextDir()
        startHop(now)
      }
    }

    const draw = (now) => {
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(grid, 0, 0, W, H)

      // rastro
      for (const [k, t] of trail) {
        const a = 1 - (now - t) / TRAIL_MS
        if (a <= 0) { trail.delete(k); continue }
        const [u, v] = k.split(',').map(Number)
        fillCell(u, v, a * 0.55)
      }

      // posición de la bola
      let bx, by
      const inPlace = pinned && !target
      if (inPlace) {
        bx = cellX(ball.u)
        by = cellY(ball.v) - Math.abs(Math.sin(now / 220)) * BOUNCE
        trail.set(key(ball.u, ball.v), now) // mantiene la celda encendida
      } else {
        const p = Math.min(1, (now - ball.t0) / HOP_MS)
        bx = cellX(ball.fromU) + (cellX(ball.u) - cellX(ball.fromU)) * p
        by = cellY(ball.fromV) + (cellY(ball.v) - cellY(ball.fromV)) * p - Math.sin(p * Math.PI) * BOUNCE
        if (p >= 1) arrive(now)
      }

      // dibujar la bola
      ctx.save()
      ctx.shadowColor = colAccent
      ctx.shadowBlur = 14
      ctx.fillStyle = colBall
      ctx.beginPath()
      ctx.arc(bx, by, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      raf = requestAnimationFrame(draw)
    }

    /* Convertir coords de puntero a celda (u,v) válida (paridad par) */
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
      // ¿tocó la bola?
      const p = pinned && !target ? 1 : Math.min(1, (performance.now() - ball.t0) / HOP_MS)
      const bx = cellX(ball.fromU) + (cellX(ball.u) - cellX(ball.fromU)) * p
      const by = cellY(ball.fromV) + (cellY(ball.v) - cellY(ball.fromV)) * p
      if (Math.hypot(mx - bx, my - by) < 22) {
        pinned = !pinned
        target = null
        if (!pinned) startHop(performance.now())
        return
      }
      const cell = pickCell(mx, my)
      if (pinned) {
        target = cell
        dirToTarget()
        startHop(performance.now())
      } else {
        trail.set(key(cell.u, cell.v), performance.now())
      }
    }

    /* ── init ── */
    resize()
    // arranque de la bola cerca del borde inferior
    ball.u = 0; ball.v = Vmax - 2; ball.fromU = ball.u; ball.fromV = ball.v
    ball.du = 1; ball.dv = -1; ball.t0 = performance.now()

    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    canvas.addEventListener('pointerdown', onPointerDown)

    // re-leer colores al cambiar de tema (data-theme en <html>)
    const themeObs = new MutationObserver(() => { readColors(); buildGrid() })
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    if (reduced) {
      // Sin animación: grilla estática + bola quieta
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
