import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'

/* ──────────────────────────────────────────────────────────────
   Bento de 6 cards con icono representativo por card.
   - Desktop: grid rectangular 4×2 (con cards anchas para variedad).
   - Móvil: cards cuadradas (2 columnas, aspect-ratio 1).
   - Colores por card legibles en tema claro y oscuro (tinte + icono a color).
   - Animación: entrada al viewport + float continuo + escala en hover.
   Reutilizado en la home (Featured) y en el detalle de proyecto.
   ────────────────────────────────────────────────────────────── */

/* ── Iconos (line-icons, heredan color vía currentColor) ── */
const S = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" {...props} />
)
const IconApi      = () => <S><path d="M8 7 3 12l5 5"/><path d="m16 7 5 5-5 5"/><path d="M13 4 11 20"/></S>
const IconUsers    = () => <S><circle cx="9" cy="8" r="3"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M16 5a3 3 0 0 1 0 6"/><path d="M22 20a6 6 0 0 0-4-5.6"/></S>
const IconShield   = () => <S><path d="M12 3 5 6v6c0 4 3 6.5 7 8 4-1.5 7-4 7-8V6z"/><path d="m9 12 2 2 4-4"/></S>
const IconCluster  = () => <S><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></S>
const IconActivity = () => <S><path d="M3 12h4l3 8 4-16 3 8h4"/></S>
const IconDevices  = () => <S><rect x="2" y="4" width="14" height="10" rx="1.5"/><path d="M2 18h14"/><rect x="17" y="9" width="5" height="11" rx="1.5"/></S>
const IconAtom     = () => <S><circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></S>
const IconServer   = () => <S><path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M12 22V12"/><path d="m3 7 9 5 9-5"/></S>
const IconCode     = () => <S><path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/></S>
const IconReceipt  = () => <S><path d="M5 3v18l2-1 2 1 2-1 2 1 2-1 2 1V3l-2 1-2-1-2 1-2-1-2 1z"/><path d="M8 8h8"/><path d="M8 12h8"/><path d="M8 16h5"/></S>
const IconBolt     = () => <S><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></S>
const IconLayers   = () => <S><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/></S>
const IconSpark    = () => <S><path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="m6 6 2.5 2.5"/><path d="m15.5 15.5 2.5 2.5"/><path d="m18 6-2.5 2.5"/><path d="m8.5 15.5-2.5 2.5"/></S>

/* Elige un icono representativo según palabras clave de la etiqueta */
function pickIcon(label) {
  const l = label.toLowerCase()
  if (/(api|rest|graphman|restman)/.test(l)) return IconApi
  if (/(usuario|admin|panel)/.test(l)) return IconUsers
  if (/(mtls|tls|seguridad|distroless)/.test(l)) return IconShield
  if (/(kubernetes|k8s|informer|sharding|cluster|pod)/.test(l)) return IconCluster
  if (/(zabbix|opentelemetry|telemetr|observab|métric|metric|monitor)/.test(l)) return IconActivity
  if (/(multiplataforma|cross|flutter|escritorio|desktop)/.test(l)) return IconDevices
  if (/react/.test(l)) return IconAtom
  if (/node/.test(l)) return IconServer
  if (/(typescript|\bts\b|código|code)/.test(l)) return IconCode
  if (/(pos|caja|venta)/.test(l)) return IconReceipt
  if (/(automat)/.test(l)) return IconBolt
  return IconSpark
}

/* Paleta de 6 hues legibles en claro y oscuro */
const HUES = ['#10B981', '#6366F1', '#F59E0B', '#0EA5E9', '#8B5CF6', '#F43F5E']
/* Desktop: rectángulo 4×2 (cards 0 y 5 ocupan 2 columnas) */
const COLSPAN = [2, 1, 1, 1, 1, 2]

const floaty = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-5px); }
`

const Bento = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 128px;
  gap: 0.7rem;

  @media (max-width: 768px) { grid-auto-rows: 112px; }
  @media (max-width: 560px) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: auto;
  }
`

const Tile = styled(motion.div)`
  grid-column: span ${p => p.$c};
  background: ${p => p.$hue}1f;
  border: 1px solid ${p => p.$hue}40;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: 1rem;
  text-align: center;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${p => p.$hue};
    background: ${p => p.$hue}2b;
  }
  &:hover svg { transform: scale(1.18) rotate(-6deg); }

  @media (max-width: 560px) {
    grid-column: span 1;
    aspect-ratio: 1 / 1;
  }
`

const IconWrap = styled.div`
  color: ${p => p.$hue};
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${floaty} 3.6s ease-in-out infinite;
  animation-delay: ${p => p.$d}s;

  svg {
    width: 1.9rem;
    height: 1.9rem;
    transition: transform 0.25s ease;
  }
`

const TileLabel = styled.span`
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.2;
  color: var(--text-primary);
`

const tileVariants = {
  offscreen: { opacity: 0, scale: 0.9, y: 12 },
  onscreen: (i) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function BentoMosaic({ project }) {
  const cards = (project.highlights || []).slice(0, 6)

  return (
    <Bento role="img" aria-label={`${project.title} — ${project.subtitle}`}>
      {cards.map((label, i) => {
        const Icon = pickIcon(label)
        const hue = HUES[i % HUES.length]
        return (
          <Tile
            key={label + i}
            $c={COLSPAN[i]}
            $hue={hue}
            custom={i}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            variants={tileVariants}
          >
            <IconWrap $hue={hue} $d={(i % 6) * 0.25}><Icon /></IconWrap>
            <TileLabel>{label}</TileLabel>
          </Tile>
        )
      })}
    </Bento>
  )
}
